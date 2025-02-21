package com.example.CateringApp.Model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "`Order`")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> listOfItems = new ArrayList<>();

    private double shipment;

    private String discountCode;

    private double totalPrice;

    public Order(Order order, double shipment, double totalPrice) {
        this.client = order.getClient();
        this.address = order.getAddress();
        this.shipment = shipment;
        this.totalPrice = totalPrice;
    }

    public Order() {
    }

    public Long getId() {
        return id;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public Client getClient() {
        return client;
    }

    public Address getAddress() {
        return address;
    }

    public List<OrderItem> getListOfItems() {
        return listOfItems;
    }

    public double getShipment() {
        return shipment;
    }

    public String getDiscountCode() {
        return discountCode;
    }

}
