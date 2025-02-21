package com.example.CateringApp.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateDietWithCalories {

    @NotBlank(message= "Nazwa jest wymagana")
    private String name;

    @NotNull(message = "Lista kalorii jest wymagana")
    private int[] calories;

    @Positive(message = "Cena musi być większa od zero")
    private double price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int[] getCalories() {
        return calories;
    }

    public void setCalories(int[] calories) {
        this.calories = calories;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

}
