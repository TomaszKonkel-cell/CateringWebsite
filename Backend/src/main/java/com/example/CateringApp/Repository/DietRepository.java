package com.example.CateringApp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CateringApp.Model.Diet;

@Repository
public interface DietRepository  extends JpaRepository<Diet, Long>{

    List<Diet> findByName(String name);

    void deleteAllByName(String name);

}
