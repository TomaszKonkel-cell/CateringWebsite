package com.example.CateringApp.Service.Order;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Order;
import com.example.CateringApp.Model.OrderItem;
import com.example.CateringApp.Response.SummaryOfPrice;

public interface OrderService {
    public List<Order> getListOfOrder();

    public Order getOrderByIdOrThrowException(Long id) throws CustomException;

    public List<Order> getListOfOrderByAddress(Address address);

    public Page<Order> getListOfOrderForClient(Long clientId, int page, int size) throws CustomException;

    public Map<String, List<Order>> getTodayOrder();

    public SummaryOfPrice getSummaryOfPrice(List<OrderItem> items);

    public Map<Long, Integer> getSumOfCompletedDaysForOrdetItems(Order order);

    public Date findFirstDate();
    
    public Order checkInputDataAndCreateOrderOrThrowException(Order order) throws CustomException;

}
