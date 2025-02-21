package com.example.CateringApp.Model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "Client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Imie jest wymagany")
    private String name;

    @NotBlank(message = "Nazwisko jest wymagany")
    private String lastName;

    @NotBlank(message = "Hasło jest wymagany")
    private String password;

    @Email(message = "Adres email musi być zapisany poprawnie")
    @NotBlank(message = "Adres email jest wymagany")
    private String email;

    @NotBlank(message = "Numer telefonu jest wymagany")
    private String phoneNumber;

    private String verificationCode;

    private boolean enabled;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> listOfAddress = new ArrayList<>();

    public Client(String name,
            String lastName,
            String password,
            String email,
            String phoneNumber) {
        this.name = name;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Client() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastName;
    }

    public void setLastname(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return this.name.toString() + " " + this.lastName.toString();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
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

    public List<Address> getListOfAddress() {
        return listOfAddress;
    }

    public void setListOfAddress(List<Address> listOfAddress) {
        this.listOfAddress = listOfAddress;
    }

}
