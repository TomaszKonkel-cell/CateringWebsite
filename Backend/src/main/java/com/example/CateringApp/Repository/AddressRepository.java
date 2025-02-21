package com.example.CateringApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CateringApp.Model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>{

    Optional<Address> findByStreetName(String streetName);

    List<Address> findAllByClientId(Long clientId);

}
