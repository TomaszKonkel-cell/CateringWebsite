package com.example.CateringApp.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CateringApp.Model.Address;
import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{

    Page<Order> findAllByClient(Client client, Pageable pageable);

    List<Order> findByAddress(Address address);

}
