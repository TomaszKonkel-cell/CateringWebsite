package com.example.CateringApp.Service.generateRandomData.Client;

import java.util.List;

import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;

public interface ClientRandomData {
    public List<Client> generateClient(int range);

    public List<Address> generateAddresses(int range);

    

}
