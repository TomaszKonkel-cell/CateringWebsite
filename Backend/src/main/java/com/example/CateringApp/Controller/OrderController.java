package com.example.CateringApp.Controller;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Order;
import com.example.CateringApp.Model.OrderItem;
import com.example.CateringApp.Response.SummaryOfPrice;
import com.example.CateringApp.Service.Order.OrderServiceImpl;
import com.example.CateringApp.Service.OrderItem.OrderItemServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    OrderServiceImpl orderService;

    @Autowired
    OrderItemServiceImpl orderItemService;

    @GetMapping("get")
    public List<Order> getListOfOrder() throws CustomException {
        return orderService.getListOfOrder();
    }

    @GetMapping("getById")
    public Order getOrderById(@RequestParam Long id) throws CustomException {
        return orderService.getOrderByIdOrThrowException(id);
    }

    @GetMapping("getAllClientOrders")
    public Page<Order> getListOfOrderForClient(@RequestParam Long clientId,
            @RequestParam(defaultValue = "0", required = false) int page,
            @RequestParam(defaultValue = "5", required = false) int size) throws CustomException {
        return orderService.getListOfOrderForClient(clientId, page, size);
    }

    @GetMapping("getByToday")
    public Map<String, List<Order>> getTodayOrders() throws CustomException {
        return orderService.getTodayOrder();
    }

    @PostMapping("add")
    public Order addToOrder(@Valid @RequestBody Order order) throws CustomException {
        return orderService.checkInputDataAndCreateOrderOrThrowException(order);
    }

    @PostMapping("getSummaryOfPrice")
    public SummaryOfPrice getSummaryOfPrice(@Valid @RequestBody List<OrderItem> items) {
        return orderService.getSummaryOfPrice(items);
    }

    @PostMapping("sumOfCompletedDays")
    public Map<Long, Integer> getSumOfCompletedDays(@Valid @RequestBody Order order) {
        return orderService.getSumOfCompletedDaysForOrdetItems(order);
    }

    @GetMapping("datesToSuspension")
    public List<Date> datesToSuspension(@RequestParam Long orderItemId) throws CustomException { 
        return orderItemService.getDatesToSuspension(orderItemId);
    }

    @PostMapping("suspensionDiet")
    public List<Date> suspensionDiet(@RequestBody List<Date> dates, @RequestParam Long orderItemId) throws CustomException { 
        return orderItemService.suspensionDiet(dates, orderItemId);
    }

}
