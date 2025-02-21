package com.example.CateringApp.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateDietWithSize {

    @NotBlank(message = "Nazwa jest wymagana")
    private String name;

    @NotNull(message= "Lista rozmiarów jest wymagana")
    private String[] size;

    @Positive(message= "Cena musi być większa od zera")
    private double price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String[] getSize() {
        return size;
    }

    public void setSize(String[] size) {
        this.size = size;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

}
