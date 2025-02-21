package com.example.CateringApp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CateringApp.Model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>{

    Optional<Client> findByEmail(String email);

    Optional<Client> findByVerificationCode(String verificationCode);
}
