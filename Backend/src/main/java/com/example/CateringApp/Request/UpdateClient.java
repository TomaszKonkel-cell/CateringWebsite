package com.example.CateringApp.Request;

import jakarta.validation.constraints.NotBlank;

public class UpdateClient {
    @NotBlank(message = "Imie jest wymagane")
    private String name;

    @NotBlank(message = "Nazwisko jest wymagane")
    private String lastname;

    @NotBlank(message = "Adres email jest wymagany")
    private String email;

    @NotBlank(message = "Numer telefonu jest wymagany")
    private String phoneNumber;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    

}
