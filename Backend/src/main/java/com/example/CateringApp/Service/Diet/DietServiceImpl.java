package com.example.CateringApp.Service.Diet;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Diet;
import com.example.CateringApp.Repository.DietRepository;
import com.example.CateringApp.Request.CreateDietWithCalories;
import com.example.CateringApp.Request.CreateDietWithSize;

@Service
public class DietServiceImpl implements DietService {
    @Autowired
    DietRepository dietRepository;

    static Logger logger = Logger.getLogger(DietServiceImpl.class.getName());

    @Override
    public List<Diet> getListOfDiet() {
        return dietRepository.findAll();
    }

    @Override
    public Diet getDietByIdOrThrowException(Long id) throws CustomException {
        return dietRepository.findById(id)
                .orElseThrow(() -> new CustomException("Dieta nie została znaleziona o podanym id: " + id));
    }

    @Override
    public List<Diet> getListOfDietByName(String name) {
        return dietRepository.findByName(name.toUpperCase());
    }

    @Override
    public Map<String, List<String>> getListOfDietNameWithAllVariants() {
        return getSortedListOfDietNameWithAllVariants(getListOfDiet());
    }

    private Map<String, List<String>> getSortedListOfDietNameWithAllVariants(List<Diet> listOfDiet) {
        List<String> listOfDietName = getListOfUniqueName(listOfDiet);

        Map<String, List<String>> listOfDietNameWithAllVariants = getAllVariantsForSpecificDietName(listOfDietName);

        return sortListOfDietNameWithAllVariants(listOfDietNameWithAllVariants);
    }

    @Override
    public List<Diet> saveDietWithCalories(CreateDietWithCalories diet) {
        List<Diet> addedDiets = new ArrayList<>();
        for (int value : diet.getCalories()) {
            Diet newDiet = new Diet(diet.getName().toUpperCase(), value, null, diet.getPrice());
            addedDiets.add(newDiet);
            dietRepository.save(newDiet);
        }
        return addedDiets;
    }

    @Override
    public List<Diet> saveDietWithSize(CreateDietWithSize diet) {
        List<Diet> addedDiets = new ArrayList<>();
        for (String value : diet.getSize()) {
            Diet newDiet = new Diet(diet.getName().toUpperCase(), 0, value, diet.getPrice());
            addedDiets.add(newDiet);
            dietRepository.save(newDiet);
        }
        return addedDiets;
    }

    @Override
    public boolean checkIfExist(Long dietId) {
        return dietRepository.existsById(dietId);
    }

    @Override
    public Diet updateDietOrThrowException(Long id, Diet diet) throws CustomException {
        Diet findDiet = getDietByIdOrThrowException(id);

        ModelMapper mapper = new ModelMapper();
        mapper.map(diet, findDiet);

        return dietRepository.save(findDiet);
    }

    @Override
    public void deleteDiet(String name) {
        dietRepository.deleteAllByName(name.toUpperCase());
    }

    public List<String> getListOfUniqueName(List<Diet> listOfDiet) {
        return listOfDiet.stream()
                .map(e -> e.getName()).distinct()
                .collect(Collectors.toList());
    }

    public Map<String, List<String>> getAllVariantsForSpecificDietName(List<String> listOfDietName) {
        Map<String, List<String>> listOfDietNameWithAllVariants = new HashMap<>();
        listOfDietName.forEach((name) -> {
            List<String> listOfCalories = getListOfDietByName(name).stream()
                    .filter(e -> e.getCalories() > 0)
                    .map(e -> String.valueOf(e.getCalories()) + " kcal")
                    .collect(Collectors.toList());
            List<String> listOfSize = getListOfDietByName(name).stream()
                    .filter(e -> e.getCalories() == 0)
                    .map(e -> e.getSize())
                    .collect(Collectors.toList());

            if (listOfCalories.isEmpty()) {
                listOfDietNameWithAllVariants.put(name, listOfSize);
            } else {
                listOfDietNameWithAllVariants.put(name, listOfCalories);
            }

        });
        return listOfDietNameWithAllVariants;
    }

    public Map<String, List<String>> sortListOfDietNameWithAllVariants(Map<String, List<String>> listOfDietNameWithAllVariants) {
        return listOfDietNameWithAllVariants.entrySet()
        .stream()
        .sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
        .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (oldValue, newValue) -> oldValue, LinkedHashMap::new));
        
    }
    

}
