package com.example.CateringApp.Service.generateRandomData.Client;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Repository.AddressRepository;
import com.example.CateringApp.Repository.ClientRepository;

import net.datafaker.Faker;

@Service
public class ClientRandomDataImpl implements ClientRandomData {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AddressRepository addressRepository;

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public List<Client> generateClient(int range) {
        List<Client> list = new ArrayList<>();
        Random rand = new Random();
        Faker faker = new Faker(new Locale("pl-PL"));

        for (int i = 0; i <= range; i++) {
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String mail = firstName.substring(0, 1).toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";

            int num1 = (rand.nextInt(8 - 5) + 5) * 100 + (rand.nextInt(9) * 10) + rand.nextInt(9);
            int num2 = rand.nextInt(743);
            int num3 = rand.nextInt(1000);

            DecimalFormat df3 = new DecimalFormat("000");

            String phoneNumber = df3.format(num1) + "-" + df3.format(num2) + "-" + df3.format(num3);

            Client client = new Client(firstName, lastName, passwordEncoder().encode("Hasło123!@"), mail, phoneNumber);
            clientRepository.save(client);
            list.add(client);

        }

        return list;
    }

    @Override
    public List<Address> generateAddresses(int range) {
        List<Address> list = new ArrayList<>();
        Random rand = new Random();
        Faker faker = new Faker(new Locale("pl-PL"));

        for (int i = 0; i <= range; i++) {

            Address address = new Address(faker.address().cityName(), faker.address().zipCode(),
                    faker.address().streetName(), rand.nextInt(100) + 1, rand.nextInt(100) + 1, "Opis",
                    "Kod dostępu");

            long number = clientRepository.count();

            Optional<Client> findClient = clientRepository.findById(rand.nextLong(number - 1) + 1);

            address.setClient(findClient.get());
            addressRepository.save(address);
            list.add(address);

        }
        return list;
    }

}
