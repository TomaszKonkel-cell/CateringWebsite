package com.example.CateringApp.Security.UserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Model.Client;
import com.example.CateringApp.Repository.ClientRepository;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsServiceImplementation implements UserDetailsService {

    @Autowired
    ClientRepository clientRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono klienta o podanym adresie email: " + email));

        return UserDetailsImplementation.build(client);
    }
}
