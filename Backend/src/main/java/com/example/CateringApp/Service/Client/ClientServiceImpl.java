package com.example.CateringApp.Service.Client;

import java.util.List;
import java.util.logging.Logger;

import org.modelmapper.internal.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Jwt.JwtUtils;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Repository.ClientRepository;
import com.example.CateringApp.Request.Login;
import com.example.CateringApp.Request.UpdateClient;
import com.example.CateringApp.Response.Logged;
import com.example.CateringApp.Security.UserDetails.UserDetailsImplementation;
import com.example.CateringApp.Service.Mail.MailServiceImpl;

import jakarta.mail.MessagingException;

@Service
public class ClientServiceImpl implements ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    MailServiceImpl mailService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    PasswordEncoder passwordEncoder;

    static Logger logger = Logger.getLogger(ClientServiceImpl.class.getName());

    @Override
    public List<Client> getListOfClient() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientByIdOrThrowException(Long id) throws CustomException {
        return clientRepository.findById(id)
                .orElseThrow(() -> new CustomException("Klient nie został znaleziony o podanym id: " + id));
    }

    @Override
    public Client getClientByEmailOrThrowException(String email) throws CustomException {
        return clientRepository.findByEmail(email).orElseThrow(
                () -> new CustomException("Klient nie został znaleziony o podanym adresie mail: " + email));
    }

    @Override
    public Client getClientByVerificationCodeOrThrowException(String token) throws CustomException {
        return clientRepository.findByVerificationCode(token).orElseThrow(
                () -> new CustomException("Niepoprawny token aktywacyjny"));
    }

    @Override
    public Client checkInputDataAndRegisterOrThrowException(Client client) throws CustomException, MessagingException {
        checkEmailExistForAnyClient(client);
        checkLengthIsMatchForGivenValue(client.getPhoneNumber(), 9);

        mailService.sendVerificationEmail(client);

        return registerClient(client);
    }

    @Override
    public void verifyClient(String token) throws CustomException {
        Client client = getClientByVerificationCodeOrThrowException(token);
        setActiveOnCLient(client);
    }

    @Override
    public void resetPassword(String email) throws CustomException, MessagingException {
        Client client = getClientByEmailOrThrowException(email);
        mailService.sendResetPasswordEmail(client);
    }

    @Override
    public void verifyReset(Long id, String newPassword) throws CustomException {
        Client client = getClientByIdOrThrowException(id);
        checkStringIsPresent(newPassword);
        saveNewPassword(client, newPassword);
    }

    @Override
    public ResponseEntity<?> login(Login login) throws CustomException {
        Client client = getClientByEmailOrThrowException(login.getEmail());

        checkClientIsActive(client);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();

        String jwtCookie = jwtUtils.generateJwtToken(userDetails);

        Logged loggedUser = new Logged(userDetails.getId(), userDetails.getUsername(), userDetails.getName(),
                userDetails.getLastName(), userDetails.getPhoneNumber(),
                System.currentTimeMillis(), jwtCookie);

        return new ResponseEntity<>(loggedUser, HttpStatus.OK);
    }

    @Override
    public void checkInputDataAndUpdateClientOrThrowException(Long id, UpdateClient client) throws CustomException {
        checkEmailExistForAnotherClient(client, id);
        checkLengthIsMatchForGivenValue(client.getPhoneNumber(), 9);

        updateClient(id, client);
    }

    @Override
    public void checkInputDataAndUpdateClientPassOrThrowException(Long id, String newPass, String oldPass) throws CustomException {
        Client findClient = getClientByIdOrThrowException(id);

        checkPasswordsIsCorrect(findClient, oldPass, newPass);

        saveNewPassword(findClient, newPass);
    }

    @Override
    public void deleteClientOrThrowException(Long id) throws CustomException {
        getClientByIdOrThrowException(id);
        clientRepository.deleteById(id);
    }

    public String generateRandomVerificationCode() {
        return RandomString.make(64);
    }

    public String convertPhoneNumber(String phoneNumber) {
        StringBuilder phoneNumberSB = new StringBuilder(phoneNumber);
        phoneNumberSB.insert(3, "-");
        phoneNumberSB.insert(7, "-");
        return phoneNumberSB.toString();
    }

    public boolean checkConfirmPassword(String confirmOldPass, String oldPass) {
        if (!passwordEncoder.matches(confirmOldPass, oldPass)) {
            return false;
        } else {
            return true;
        }
    }

    public void checkEmailExistForAnyClient(Client client) throws CustomException {
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            throw new CustomException("Taki adres email już istnieje lub konto jest w trakcie aktywacji");
        }
    }

    public void checkEmailExistForAnotherClient(UpdateClient client, Long id) throws CustomException {
        if (clientRepository.findByEmail(client.getEmail()).isPresent()
                && clientRepository.findByEmail(client.getEmail()).get().getId() != id) {
            throw new CustomException("Nie można zmienić adresu na już istniejący");
        }
    }

    public boolean checkLengthIsMatchForGivenValue(String text, int length) throws CustomException {
        if (text.length() == length) {
            return true;
        } else {
            throw new CustomException("Numer telefonu musi mieć podane 9 znaków, bez żadnych dodatkowych znaków");
        }
    }

    public boolean checkStringIsPresent(String text) {
        if (text.isEmpty()) {
            return false;
        } else {
            return true;
        }
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public void saveNewPassword(Client client, String newPassword) {
        client.setPassword(encodePassword(newPassword));
        clientRepository.save(client);
    }

    public void setActiveOnCLient(Client client) throws CustomException {
        client.setEnabled(true);
        client.setVerificationCode(null);
        clientRepository.save(client);
    }

    public void checkClientIsActive(Client client) throws CustomException {
        if (!client.isEnabled()) {
            throw new CustomException("Konto nie zostało aktywowane, sprawdź skrzynke mailową: " + client.getEmail());
        }
    }

    public void checkPasswordsIsCorrect(Client findClient, String oldPass, String newPass) throws CustomException {
        if (!checkStringIsPresent(oldPass) || !checkStringIsPresent(newPass)) {
            throw new CustomException("Wszystkie pola muszą być uzupełnione");
        }
        if (!checkConfirmPassword(oldPass, findClient.getPassword())) {
            throw new CustomException("Podano błędne stare hasło");
        }
        if (oldPass.equals(newPass)) {
            throw new CustomException("Hasła są takie same");
        }
    }

    public Client registerClient(Client client) throws CustomException {

        client.setPhoneNumber(convertPhoneNumber(client.getPhoneNumber()));
        client.setVerificationCode(generateRandomVerificationCode());
        client.setPassword(encodePassword(client.getPassword()));

        return clientRepository.save(client);
    }

    public void updateClient(Long id, UpdateClient client) throws CustomException {
        Client findClient = getClientByIdOrThrowException(id);

        findClient.setName(client.getName());
        findClient.setLastname(client.getLastname());
        findClient.setEmail(client.getEmail());
        findClient.setPhoneNumber(convertPhoneNumber(client.getPhoneNumber()));

        clientRepository.save(findClient);
    }

}
