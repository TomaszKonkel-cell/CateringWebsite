package com.example.CateringApp.Response;

public class SummaryOfPrice {
    private double basicPrice;
    private double discount;
    private double shipment;
    private double totalPrice;

    public SummaryOfPrice(double basicPrice, double discount, double shipment, double totalPrice) {
        this.basicPrice = basicPrice;
        this.discount = discount;
        this.shipment = shipment;
        this.totalPrice = totalPrice;
    }

    public double getBasicPrice() {
        return basicPrice;
    }

    public double getDiscount() {
        return discount;
    }

    public double getShipment() {
        return shipment;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

}
