package com.example.CateringApp.Service.Address;

import java.util.List;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Address;

public interface AddressService {
    public List<Address> getListOfAddress();

    public Address getAddressByIdOrThrowException(Long id) throws CustomException;

    public Address getAddressByStreetNameOrThrowException(String streetName) throws CustomException;

    public List<Address> getListOfAddressForClient(Long clientId) throws CustomException;

    public Address checkInputDataAndSaveAddressOrThrowException(Long clientId, Address address) throws CustomException;

    public Address checkInputDataAndUpdateOrCreateAddressOrThrowException(Long id, Address address) throws CustomException;

    public Address updateAddressForOrderIfIsActive(Long orderId, Address address) throws CustomException;

    public void deleteAddressIfNotMemberOfOrder(Long id) throws CustomException;
}
