package com.example.CateringApp.Controller;

import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Request.Login;
import com.example.CateringApp.Request.UpdateClient;
import com.example.CateringApp.Service.Client.ClientServiceImpl;
import com.example.CateringApp.Service.generateRandomData.Client.ClientRandomDataImpl;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired
    private ClientRandomDataImpl clientRandomData;

    @Autowired
    private ClientServiceImpl clientService;

    static Logger logger = Logger.getLogger(ClientController.class.getName());

    @PostMapping("generateClientsAndAddress")
    public void generateClientsAndAddress() {
        Random rand = new Random();
        int range = rand.nextInt(30 - 5) + 1;

        List<Client> userList = clientRandomData.generateClient(range);
        List<Address> addressesList = clientRandomData.generateAddresses(range);

        logger.info("Wygenerowani klienci: " + userList.size());
        logger.info("Wygenerowane adresy: " + addressesList.size());
    }

    @GetMapping("getAddressesForClient")
    public List<Address> getAddressesForClient(Long id) throws CustomException {
        Client findClient = clientService.getClientByIdOrThrowException(id);

        return findClient.getListOfAddress();

    }

    @GetMapping("get")
    public List<Client> getClients() {
        return clientService.getListOfClient();
    }

    @GetMapping("getById")
    public Client getClientById(@RequestParam Long id) throws CustomException {
        return clientService.getClientByIdOrThrowException(id);
    }

    @GetMapping("getByEmail")
    public Client getClienyByEmail(@RequestParam String email) throws CustomException {
        return clientService.getClientByEmailOrThrowException(email);
    }

    @PostMapping("register")
    public Client register(@Valid @ModelAttribute Client client) throws CustomException, MessagingException {
        return clientService.checkInputDataAndRegisterOrThrowException(client);
    }

    @GetMapping("verificateClient")
    public void verificateClient(@RequestParam String token) throws CustomException {
        clientService.verifyClient(token);
    }

    @GetMapping("verificateReset")
    public void verificateReset(@RequestParam Long id, String newPassword) throws CustomException, MessagingException {
        clientService.verifyReset(id, newPassword);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@Valid @ModelAttribute Login login) throws CustomException {
        return clientService.login(login);
    }

    @PostMapping("reset")
    public void resetPassword(@RequestParam String email) throws CustomException, MessagingException {
        clientService.resetPassword(email);
    }

    @PutMapping("update")
    public void updateClient(@RequestParam Long id, @Valid @ModelAttribute UpdateClient client) throws CustomException {
        clientService.checkInputDataAndUpdateClientOrThrowException(id, client);
    }

    @PutMapping("updatePass")
    public void updateClientPass(@RequestParam Long id, @RequestParam String newPass, @RequestParam String oldPass)
            throws CustomException {
        clientService.checkInputDataAndUpdateClientPassOrThrowException(id, newPass, oldPass);
    }

    @DeleteMapping("delete")
    public void deleteClient(@RequestParam Long id) throws CustomException {
        clientService.deleteClientOrThrowException(id);
    }
}
