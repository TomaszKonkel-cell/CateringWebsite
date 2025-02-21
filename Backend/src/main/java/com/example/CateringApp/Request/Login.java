package com.example.CateringApp.Request;

import jakarta.validation.constraints.NotBlank;

public class Login {

    @NotBlank(message = "Adres email jest wymagany")
    private String email;
    @NotBlank(message = "Hasło jest wymagany")
    private String password;

    public Login(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    

}

