package com.example.CateringApp.Security.UserDetails;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.CateringApp.Model.Client;

public class UserDetailsImplementation implements UserDetails {
  private static final long serialVersionUID = 1L;

  private Long id;

  private String email;

  private String password;

  private String name;

  private String lastName;

  private String phoneNumber;

  private Collection<? extends GrantedAuthority> authorities;

  public static UserDetailsImplementation build(Client client) {

    return new UserDetailsImplementation(
        client.getId(),
        client.getEmail(),
        client.getPassword(),
        client.getName(),
        client.getLastname(),
        client.getPhoneNumber());
  }

  public UserDetailsImplementation(Long id, String email, String password, String name, String lastName,
      String phoneNumber) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getLastName() {
    return lastName;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public static long getSerialversionuid() {
    return serialVersionUID;
  }

  public String getEmail() {
    return email;
  }

}
