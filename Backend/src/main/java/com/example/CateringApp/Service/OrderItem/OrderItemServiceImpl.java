package com.example.CateringApp.Service.OrderItem;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.OrderItem;
import com.example.CateringApp.Repository.OrderItemRepository;
import com.example.CateringApp.Service.Order.OrderServiceImpl;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    OrderServiceImpl orderService;

    @Override
    public OrderItem saveItem(OrderItem item) {
        return orderItemRepository.save(item);
    }

    @Override
    public OrderItem findOrderItemByIdOrThrowException(Long orderItemId) throws CustomException {
        return orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new CustomException("Pozycja nie została znaleziona o podanym id: " + orderItemId));
    }

    @Override
    public List<Date> getDatesToSuspension(Long orderItemId) throws CustomException {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new CustomException("Pozycja nie została znaleziona o podanym id: " + orderItemId));
        List<Date> orderDates = orderItem.getOrderDates();

        Date startDate = orderService.findFirstDate();
        List<Date> availableDatesToSuspense = orderDates.stream().filter(date -> date.after(startDate) || date.equals(startDate))
                .collect(Collectors.toList());
        return availableDatesToSuspense;
    }

    @Override
    public List<Date> suspensionDiet(List<Date> dates, Long orderItemId) throws CustomException {
        checkDatesToSuspension(dates);

        OrderItem orderItem = findOrderItemByIdOrThrowException(orderItemId);
        List<Date> orderItemDates = orderItem.getOrderDates();

        List<Date> newOrderItemDates = removeDatesFromOrderItemDatesAndAddNextDate(dates, orderItemDates);

        orderItem.setOrderDates(newOrderItemDates);
        orderItem.setStartDate(newOrderItemDates.get(0).toString());
        saveItem(orderItem);
        return dates;
    }

    @Override
    public void checkDatesToSuspension(List<Date> dates) throws CustomException {
        Date startDateToSuspension = orderService.findFirstDate();
        if (dates.isEmpty()) {
            throw new CustomException("Lista dat do zawieszenia nie może być pusta");
        }
        for (Date date : dates) {
            if (date.before(startDateToSuspension)) {
                throw new CustomException("Najbliższa data do zawieszenia to: " + startDateToSuspension);
            }
        }
    }

    @Override
    public List<Date> removeDatesFromOrderItemDatesAndAddNextDate(List<Date> dates, List<Date> orderItemDates) {
        dates.forEach(date -> {
            if (checkDateExistInOrderItemDates(orderItemDates, date)) {
                LocalDate nextDay = findNextDateForOrderItemDates(orderItemDates);
                orderItemDates.remove(Date.valueOf(date.toString()));
                orderItemDates.add(Date.valueOf(nextDay));
            }
        });
        return orderItemDates;
    }

    @Override
    public boolean checkDateExistInOrderItemDates(List<Date> orderItemDates, Date date) {
        return orderItemDates.contains(Date.valueOf(date.toString()));
    }

    @Override
    public LocalDate findNextDateForOrderItemDates(List<Date> orderItemDates) {
        LocalDate nextDay = orderItemDates.get(orderItemDates.size() - 1).toLocalDate().plusDays(1);
        if (nextDay.getDayOfWeek().toString().equals("SATURDAY")) {
            nextDay = nextDay.plusDays(2);
        }
        if (nextDay.getDayOfWeek().toString().equals("SUNDAY")) {
            nextDay = nextDay.plusDays(1);
        }
        return nextDay;
    }

}
