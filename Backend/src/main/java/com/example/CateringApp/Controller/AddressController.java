package com.example.CateringApp.Controller;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.example.CateringApp.Service.Address.AddressServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/address")
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressServiceImpl addressService;

    static Logger logger = Logger.getLogger(AddressController.class.getName());

    @GetMapping("get")
    public List<Address> getAddresses() {
        return addressService.getListOfAddress();
    }

    @GetMapping("getById")
    public Address getAddressById(@RequestParam Long id) throws CustomException {
        return addressService.getAddressByIdOrThrowException(id);
    }

    @GetMapping("getForClient")
    public List<Address> getAddresses(@RequestParam Long clientId) throws CustomException {
        return addressService.getListOfAddressForClient(clientId);
    }
    
    @PostMapping("save")
    public Address saveAddress(@RequestParam Long clientId, @Valid @ModelAttribute Address address) throws CustomException {
        return addressService.checkInputDataAndSaveAddressOrThrowException(clientId, address);
    }

    @PutMapping("update")
    public Address updateAdress(@RequestParam Long id, @Valid @ModelAttribute Address address) throws CustomException {
        return addressService.checkInputDataAndUpdateOrCreateAddressOrThrowException(id, address);
    }

    @PutMapping("updateOrderAddres")
    public Address updateOrderAdress(@RequestParam Long orderId, @Valid @ModelAttribute Address address) throws CustomException {
        return addressService.updateAddressForOrderIfIsActive(orderId, address);
    }

    @DeleteMapping("delete")
    public void deleteAddress(@RequestParam Long id) throws CustomException {
        addressService.deleteAddressIfNotMemberOfOrder(id);
    }

}
