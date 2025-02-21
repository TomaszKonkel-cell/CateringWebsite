package com.example.CateringApp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "Address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nazwa miasta jest wymagany")
    private String cityName;

    @NotBlank(message = "Kod pocztowy jest wymagany")
    private String zipCode;

    @NotBlank(message = "Nazwa ulicy jest wymagany")
    private String streetName;

    @NotNull(message = "Numer budynku jest wymagany")
    @Positive(message = "Numer budynku musi być dodatni")
    private int buldingNumber;

    @Nullable
    private int apartmentNumber;

    @NotBlank(message = "Opis jest wymagany")
    private String description;

    @Nullable
    private String accessCode;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    public Address(String cityName, String zipCode, String streetName, 
            int buldingNumber, int apartmentNumber, String description, String accessCode) {
        this.streetName = streetName;
        this.cityName = cityName;
        this.zipCode = zipCode;
        this.buldingNumber = buldingNumber;
        this.apartmentNumber = apartmentNumber;
        this.description = description;
        this.accessCode = accessCode;
    }

    public Address() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public int getBuldingNumber() {
        return buldingNumber;
    }

    public void setBuldingNumber(int buldingNumber) {
        this.buldingNumber = buldingNumber;
    }

    public int getApartmentNumber() {
        return apartmentNumber;
    }

    public void setApartmentNumber(int apartmentNumber) {
        this.apartmentNumber = apartmentNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAccessCode() {
        return accessCode;
    }

    public void setAccessCode(String accessCode) {
        this.accessCode = accessCode;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

}
