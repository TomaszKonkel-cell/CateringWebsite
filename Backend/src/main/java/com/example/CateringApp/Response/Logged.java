package com.example.CateringApp.Response;

public class Logged {
    private Long id;

    private String username;

    private Long loginTime;

    private String token;

    private String name;

    private String lastname;

    private String phoneNumber;

    public Logged(Long id, String username, String name, String lastname,
            String phoneNumber, Long loginTime, String token) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.loginTime = loginTime;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastName(String lastname) {
        this.lastname = lastname;
    }

    public String getFullName() {
        return this.name.toString() + " " + this.lastname.toString();
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Long loginTime) {
        this.loginTime = loginTime;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
