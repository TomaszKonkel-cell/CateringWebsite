package com.example.CateringApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CateringApp.Model.OrderItem;

@Repository
public interface OrderItemRepository  extends JpaRepository<OrderItem, Long>{
}
