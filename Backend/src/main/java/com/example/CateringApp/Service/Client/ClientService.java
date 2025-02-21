package com.example.CateringApp.Service.Client;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Request.Login;
import com.example.CateringApp.Request.UpdateClient;

import jakarta.mail.MessagingException;

public interface ClientService {
    public List<Client> getListOfClient();

    public Client getClientByIdOrThrowException(Long id) throws CustomException;

    public Client getClientByEmailOrThrowException(String email) throws CustomException;

    public Client getClientByVerificationCodeOrThrowException(String token) throws CustomException;

    public Client checkInputDataAndRegisterOrThrowException(Client client) throws CustomException, MessagingException;

    public void verifyClient(String token) throws CustomException;

    public void resetPassword(String email) throws CustomException, MessagingException;

    public void verifyReset(Long id, String newPassword) throws CustomException;

    public ResponseEntity<?> login(Login Login) throws CustomException;

    public void checkInputDataAndUpdateClientOrThrowException(Long id, UpdateClient client) throws CustomException;

    public void checkInputDataAndUpdateClientPassOrThrowException(Long id, String newPass, String oldPass) throws CustomException;

    public void deleteClientOrThrowException(Long id) throws CustomException;

    
}
