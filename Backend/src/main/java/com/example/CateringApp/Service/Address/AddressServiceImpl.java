package com.example.CateringApp.Service.Address;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Model.Order;
import com.example.CateringApp.Repository.AddressRepository;
import com.example.CateringApp.Service.Client.ClientServiceImpl;
import com.example.CateringApp.Service.Order.OrderServiceImpl;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ClientServiceImpl clientService;

    @Autowired
    private OrderServiceImpl orderService;

    @Override
    public List<Address> getListOfAddress() {
        return addressRepository.findAll();
    }

    @Override
    public Address getAddressByIdOrThrowException(Long id) throws CustomException {
        return addressRepository.findById(id)
                .orElseThrow(() -> new CustomException("Adres nie został znaleziony o podanym id: " + id));
    }

    @Override
    public Address getAddressByStreetNameOrThrowException(String streetName) throws CustomException {
        return addressRepository.findByStreetName(streetName)
                .orElseThrow(() -> new CustomException("Adres nie został znaleziony o podanej nazwie: " + streetName));
    }

    @Override
    public List<Address> getListOfAddressForClient(Long clientId) throws CustomException {
        return addressRepository.findAllByClientId(clientId);
    }

    @Override
    public Address checkInputDataAndSaveAddressOrThrowException(Long clientId, Address address) throws CustomException {
        Client findClient = clientService.getClientByIdOrThrowException(clientId);
        checkLengthIsMatchForGivenValue(address.getZipCode(), 5);

        return saveAddress(findClient, address);
    }

    @Override
    public Address checkInputDataAndUpdateOrCreateAddressOrThrowException(Long id, Address newAddress) throws CustomException {
        Address findAddress = getAddressByIdOrThrowException(id);
        Client clientFromAddress = findAddress.getClient();

        checkLengthIsMatchForGivenValue(newAddress.getZipCode(), 5);

        if (getNumberOfOrdersForAddress(findAddress) > 0) {
            deleteLinkToClient(findAddress);
            newAddress.setId(null);
            return saveAddress(clientFromAddress, newAddress);
        } else {
            newAddress.setClient(clientFromAddress);
            return updateAddress(newAddress, findAddress);
        }

    }

    @Override
    public Address updateAddressForOrderIfIsActive(Long orderId, Address newAddress) throws CustomException {
        Order order = orderService.getOrderByIdOrThrowException(orderId);
        String lastDate = orderService.getLastDateFromListOfDateForOrderItems(order.getListOfItems());

        orderService.checkOrderIsActiveByDate(lastDate);
        checkLengthIsMatchForGivenValue(newAddress.getZipCode(), 5);
        
        return updateAddress(newAddress, order.getAddress());

    }

    @Override
    public void deleteAddressIfNotMemberOfOrder(Long id) throws CustomException {
        Address findAddress = getAddressByIdOrThrowException(id);
        if (getNumberOfOrdersForAddress(findAddress) > 0) {
            throw new CustomException("Adres należy do zamówienia");
        }
        deletetAddress(id);
    }

    public String convertZipCode(String zipCode) {
        StringBuilder zipCodeSB = new StringBuilder(zipCode);
        zipCodeSB.insert(2, "-");
        return zipCodeSB.toString();
    }

    public boolean checkLengthIsMatchForGivenValue(String text, int length) throws CustomException {
        if (text.length() == length) {
            return true;
        } else {
            throw new CustomException("Kod pocztowy musi mieć podane 5 znaków, bez żadnych dodatkowych znaków");
        }
    }

    public int getNumberOfOrdersForAddress(Address address) {
        return orderService.getListOfOrderByAddress(address).size();
    }

    public void deleteLinkToClient(Address address) {
        address.setClient(null);
        addressRepository.save(address);
    }

    public Address saveAddress(Client findClient, Address address) {
        address.setClient(findClient);
        address.setZipCode(convertZipCode(address.getZipCode()));
        return addressRepository.save(address);
    }

    public Address updateAddress(Address newAddress, Address findAddress) {
        Long addressId = findAddress.getId();

        ModelMapper mapper = new ModelMapper();
        mapper.map(newAddress, findAddress);
        
        findAddress.setId(addressId);
        findAddress.setZipCode(convertZipCode(newAddress.getZipCode()));
        return addressRepository.save(findAddress);
    }

    public void deletetAddress(Long id) {
        addressRepository.deleteById(id);
    }

}
