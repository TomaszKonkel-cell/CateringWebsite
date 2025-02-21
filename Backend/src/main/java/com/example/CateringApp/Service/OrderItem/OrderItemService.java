package com.example.CateringApp.Service.OrderItem;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.OrderItem;

public interface OrderItemService {
    public OrderItem saveItem(OrderItem item);

    public OrderItem findOrderItemByIdOrThrowException(Long orderItemId) throws CustomException;

    public List<Date> getDatesToSuspension(Long orderItemId) throws CustomException;

    public List<Date> suspensionDiet(List<Date> dates, Long orderItemId) throws CustomException;

    public void checkDatesToSuspension(List<Date> dates) throws CustomException;

    public List<Date> removeDatesFromOrderItemDatesAndAddNextDate(List<Date> dates, List<Date> orderItemDates);

    public boolean checkDateExistInOrderItemDates(List<Date> orderItemDates, Date date);

    public LocalDate findNextDateForOrderItemDates(List<Date> orderItemDates);

}
