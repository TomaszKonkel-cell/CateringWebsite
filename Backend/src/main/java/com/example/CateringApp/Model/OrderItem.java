package com.example.CateringApp.Model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "OrderItem")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Ilość jest wymagana")
    @Positive(message = "Ilość musi być dodatnia")
    private int quantity;

    @NotBlank(message = "Data startowa jest wymagane")
    private String startDate;

    @NotNull(message = "Liczba dni jest wymagana")
    @Min(1)
    @Max(60)
    private Long numberOfDays;

    private List<Date> orderDates = new ArrayList<>();

    private double discount;

    private boolean weekend;

    @ManyToOne
    @JoinColumn(name = "diet_id")
    private Diet diet;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    public OrderItem() {
    }

    public OrderItem(
            int quantity,
            String startDate,
            Long numberOfDays, List<Date> orderDates, double discount, boolean weekend, Diet diet, Order order) {
        this.quantity = quantity;
        this.startDate = startDate;
        this.numberOfDays = numberOfDays;
        this.discount = discount;
        this.weekend = weekend;
        this.diet = diet;
        this.order = order;
        this.orderDates = orderDates;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Diet getDiet() {
        return diet;
    }

    public void setDiet(Diet diet) {
        this.diet = diet;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public Long getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(Long numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    public List<Date> getOrderDates() {
        return orderDates;
    }

    public void setOrderDates(List<Date> orderDates) {
        this.orderDates = orderDates;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public boolean isWeekend() {
        return weekend;
    }

    public void setWeekend(boolean weekend) {
        this.weekend = weekend;
    }

}
