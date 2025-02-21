package com.example.CateringApp.Service.Diet;

import java.util.List;
import java.util.Map;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Diet;
import com.example.CateringApp.Request.CreateDietWithCalories;
import com.example.CateringApp.Request.CreateDietWithSize;

public interface DietService {
    public List<Diet> getListOfDiet();

    public Diet getDietByIdOrThrowException(Long id) throws CustomException;

    public List<Diet> getListOfDietByName(String name);

    public Map<String, List<String>> getListOfDietNameWithAllVariants();

    public List<Diet> saveDietWithCalories(CreateDietWithCalories diet);

    public List<Diet> saveDietWithSize(CreateDietWithSize diet);

    public boolean checkIfExist(Long dietId);

    public Diet updateDietOrThrowException(Long id, Diet diet) throws CustomException;

    public void deleteDiet(String name);

}
