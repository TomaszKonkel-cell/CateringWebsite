package com.example.CateringApp.Service.Order;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Model.Order;
import com.example.CateringApp.Model.OrderItem;
import com.example.CateringApp.Repository.OrderRepository;
import com.example.CateringApp.Response.SummaryOfPrice;
import com.example.CateringApp.Service.Address.AddressServiceImpl;
import com.example.CateringApp.Service.Client.ClientServiceImpl;
import com.example.CateringApp.Service.Diet.DietServiceImpl;
import com.example.CateringApp.Service.OrderItem.OrderItemServiceImpl;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    DietServiceImpl dietService;

    @Autowired
    OrderItemServiceImpl orderItemService;

    @Autowired
    ClientServiceImpl clientService;

    @Autowired
    AddressServiceImpl addressService;

    @Override
    public List<Order> getListOfOrder() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderByIdOrThrowException(Long id) throws CustomException {
        return orderRepository.findById(id)
                .orElseThrow(() -> new CustomException("Zamówienie nie zostało znalezione o podanym id: " + id));
    }

    @Override
    public List<Order> getListOfOrderByAddress(Address address) {
        return orderRepository.findByAddress(address);
    }

    @Override
    public Page<Order> getListOfOrderForClient(Long clientId, int page, int size) throws CustomException {
        Client client = clientService.getClientByIdOrThrowException(clientId);
        Sort sort = Sort.by("id").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return orderRepository.findAllByClient(client, pageable);
    }

    @Override
    public Map<String, List<Order>> getTodayOrder() {
        List<Order> orders = orderRepository.findAll();
        Map<String, List<Order>> ordersForClient = new HashMap<>();

        orders.forEach(order -> {
            Date today = Date.valueOf(new Date(System.currentTimeMillis()).toString());
            String currentIndex = "Klient id: " + order.getClient().getId();
            List<Order> currentOrders = new ArrayList<>();
            order.getListOfItems().forEach(item -> {
                if (item.getOrderDates().contains(today)) {
                    if (ordersForClient.containsKey(currentIndex)) {
                        List<Order> clientOrders = ordersForClient.get(currentIndex);
                        clientOrders.add(order);
                        ordersForClient.remove(currentIndex);
                        ordersForClient.put(currentIndex, clientOrders);
                    } else {
                        currentOrders.add(order);
                        ordersForClient.put(currentIndex, currentOrders);
                    }

                }
            });

        });

        return ordersForClient;
    }

    @Override
    public SummaryOfPrice getSummaryOfPrice(List<OrderItem> items) {
        double basicPrice = getBasicPrice(items);
        double shipment = getShipment(items);
        double discount = getSumOfDiscount(items);
        double totalPrice = getTotalPrice(items, shipment);

        SummaryOfPrice result = new SummaryOfPrice(basicPrice, discount, shipment, totalPrice);

        return result;
    }

    @Override
    public Map<Long, Integer> getSumOfCompletedDaysForOrdetItems(Order order) {
        List<OrderItem> items = order.getListOfItems();
        return getDaysForOrderItems(items);
    }

    @Override
    public Order checkInputDataAndCreateOrderOrThrowException(Order order) throws CustomException {
        checkOrderDataInput(order);
        checkListOfOrderItemDataInput(order.getListOfItems());

        Order newOrder = saveOrder(order);

        saveOrderItems(order.getListOfItems(), newOrder);

        return order;
    }

    public void checkOrderDataInput(Order order) throws CustomException {

        clientService.getClientByIdOrThrowException(order.getClient().getId());
        addressService.getAddressByIdOrThrowException(order.getAddress().getId());

        if (!checkAddressBelongToClient(order.getClient().getId(), order.getAddress().getId())) {
            throw new CustomException("Adres nie należy do klienta");
        }

        if (getSizeOfListOfOrderItem(order.getListOfItems()) == 0) {
            throw new CustomException("Lista pozycji jest pusta");
        }

    }

    public void checkListOfOrderItemDataInput(List<OrderItem> items) throws CustomException {
        List<Long> listOfDietId = new ArrayList<>();
        Date firstAvailableDate = findFirstDate();
        for (OrderItem item : items) {
            listOfDietId.add(item.getDiet().getId());
            String startDateDay = getDayNameFromDate(item.getStartDate());

            if (!checkFormatDate(item.getStartDate())) {
                throw new CustomException("Błędny format daty");
            }
            if (Date.valueOf(item.getStartDate()).before(firstAvailableDate)) {
                throw new CustomException(
                        "Najbliższa data dostawy to: " + firstAvailableDate);
            }
            if (startDateDay.equals("SUNDAY") || startDateDay.equals("SATURDAY")) {
                throw new CustomException("Data początkowa nie może być w weekend");
            }

            if (!dietService.checkIfExist(item.getDiet().getId())) {
                throw new CustomException("Taka dieta nie istnieje");
            }

            double correctPrice = dietService.getDietByIdOrThrowException(item.getDiet().getId()).getPricePerUnit();
            double requestPrice = item.getDiet().getPricePerUnit();

            if (correctPrice != requestPrice) {
                throw new CustomException("Cena w żądaniu nie pasuje do ceny diety");
            }

            if (item.getQuantity() <= 0 || item.getDiet().getPricePerUnit() <= 0 || item.getNumberOfDays() < 1) {
                throw new CustomException("Parametry liczbowe muszą być obecne i dodatnie");
            }
        }

        List<Long> getDistinctListOfDietId = listOfDietId.stream().distinct().collect(Collectors.toList());

        if (listOfDietId.size() != getDistinctListOfDietId.size()) {
            throw new CustomException("W żądaniu znajdują się powtórzone diety");
        }

    }

    public Order saveOrder(Order order) {
        double shipment = getShipment(order.getListOfItems());
        double totalPrice = getTotalPrice(order.getListOfItems(), shipment);

        Order newOrder = new Order(order, shipment, totalPrice);
        return orderRepository.save(newOrder);
    }

    public void saveOrderItems(List<OrderItem> items, Order order) {
        items.forEach(item -> {
            OrderItem orderItem = new OrderItem(item.getQuantity(), item.getStartDate(), item.getNumberOfDays(),
                    generateListOfDates(item.getStartDate(), item.getNumberOfDays(), item.isWeekend()),
                    getExceptedDiscount(item),
                    item.isWeekend(),
                    item.getDiet(), order);
            orderItemService.saveItem(orderItem);
        });
    }

    public Map<Long, Integer> getDaysForOrderItems(List<OrderItem> items) {
        Map<Long, Integer> daysForOrderItem = new HashMap<>();
        items.forEach((item) -> {
            Date today = new Date((System.currentTimeMillis()));
            List<Date> listOfDaysForOrderItem = item.getOrderDates();
            int sumOfDates = listOfDaysForOrderItem.stream().filter(date -> date.before(today))
                    .collect(Collectors.toList()).size();
            daysForOrderItem.put(item.getId(), sumOfDates);
        });
        return daysForOrderItem;
    }

    public int getSizeOfListOfOrderItem(List<OrderItem> items) {
        return items.size();
    }

    public double getBasicPrice(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(item -> item.getDiet().getPricePerUnit() *
                        item.getQuantity() * item.getNumberOfDays())
                .sum();
    }

    public double getShipment(List<OrderItem> items) {
        List<String> listOfDates = getListOfAllDatesForOrderItems(items);
        List<String> distinctListOfDates = getListOfDistinctDatesForOrderItems(listOfDates);
        return distinctListOfDates.size() * 8;
    }

    public List<String> getListOfAllDatesForOrderItems(List<OrderItem> items) {
        List<String> listOfAllDatesForOrderItems = new ArrayList<>();
        items.forEach(item -> {
            generateListOfDates(item.getStartDate(), item.getNumberOfDays(), item.isWeekend()).forEach(date -> {
                listOfAllDatesForOrderItems.add(date.toString());
            });
        });
        return listOfAllDatesForOrderItems;
    }

    public List<String> getListOfDistinctDatesForOrderItems(List<String> listOfDates) {
        return listOfDates.stream().distinct().collect(Collectors.toList());
    }

    public String getLastDateFromListOfDateForOrderItems(List<OrderItem> items) {
        List<String> listOfAllDates = getListOfAllDatesForOrderItems(items);
        List<String> distinctlistOfDates = getListOfDistinctDatesForOrderItems(listOfAllDates);
        return distinctlistOfDates.get(distinctlistOfDates.size() - 1);
    }

    public void checkOrderIsActiveByDate(String lastDate) throws CustomException {
        Date today = new Date((System.currentTimeMillis()));
        if (Date.valueOf(lastDate).before(Date.valueOf(today.toLocalDate()))) {
            throw new CustomException("Zamówienie nie jest już aktywne");
        }
    }

    private double getExceptedDiscount(OrderItem item) {
        double discount = 1;
        if (item.getNumberOfDays() > 1 && item.getNumberOfDays() <= 15) {
            discount = 0.95;
        }
        if (item.getNumberOfDays() > 15) {
            discount = 0.9;
        }
        return discount;
    }

    private double getSumOfDiscount(List<OrderItem> items) {
        return getBasicPrice(items) - getTotalPrice(items, 0);
    }

    public double getTotalPrice(List<OrderItem> items, double shipment) {
        return items.stream()
                .mapToDouble(item -> item.getDiet().getPricePerUnit() *
                        item.getQuantity() * item.getNumberOfDays() * getExceptedDiscount(item))
                .sum() + shipment;
    }

    public String getDayNameFromDate(String date) {
        return Date.valueOf(date).toLocalDate().getDayOfWeek().toString();
    }

    public List<Date> generateListOfDates(String startDate, Long numberOfDays, boolean weekend) {
        List<Date> listOfDates = new ArrayList<>();
        int days = 0;

        Date date = Date.valueOf(startDate);
        listOfDates.add(date);
        days++;

        while (listOfDates.size() < numberOfDays) {

            DayOfWeek day = date.toLocalDate().plusDays(days).getDayOfWeek();
            if (day.toString().equals("SATURDAY")) {
                if (weekend) {
                    Date nextDate = Date.valueOf(date.toLocalDate().plusDays(days));
                    listOfDates.add(nextDate);
                    days = days + 2;
                } else {
                    days = days + 2;
                    Date nextDate = Date.valueOf(date.toLocalDate().plusDays(days));
                    listOfDates.add(nextDate);
                    days++;
                }
            } else {
                Date nextDate = Date.valueOf(date.toLocalDate().plusDays(days));
                listOfDates.add(nextDate);
                days++;
            }

        }
        return listOfDates;
    }

    @Override
    public Date findFirstDate() {
        Date today = new Date((System.currentTimeMillis()));
        Date availableDate = Date.valueOf(today.toLocalDate().plusDays(2));

        if (availableDate.toLocalDate().getDayOfWeek().toString().equals("SATURDAY")) {
            availableDate = Date.valueOf(availableDate.toLocalDate().plusDays(2));
        }

        if (availableDate.toLocalDate().getDayOfWeek().toString().equals("SUNDAY")) {
            availableDate = Date.valueOf(availableDate.toLocalDate().plusDays(1));
        }

        return availableDate;
    }

    private boolean checkFormatDate(String date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("2025-MM-dd");
        dateFormat.setLenient(false);
        try {
            dateFormat.parse(date.trim());
        } catch (ParseException pe) {
            return false;
        }
        return true;
    }

    private boolean checkAddressBelongToClient(Long clientId, Long addressId) throws CustomException {
        Client client = clientService.getClientByIdOrThrowException(clientId);
        Address address = addressService.getAddressByIdOrThrowException(addressId);
        List<Long> addressIds = client.getListOfAddress().stream()
                .map(Address::getId).collect(Collectors.toList());
        if (addressIds.contains(address.getId())) {
            return true;
        } else {
            return false;
        }
    }

}
