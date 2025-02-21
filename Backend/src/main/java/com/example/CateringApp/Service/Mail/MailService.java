package com.example.CateringApp.Service.Mail;

import com.example.CateringApp.Model.Client;

import jakarta.mail.MessagingException;

public interface MailService {

    public void sendVerificationEmail(Client client) throws MessagingException;

    public void sendResetPasswordEmail(Client client) throws MessagingException;
}
