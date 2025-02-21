package com.example.CateringApp.Controller;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.CateringApp.Exceptions.CustomException;
import com.example.CateringApp.Model.Diet;
import com.example.CateringApp.Request.CreateDietWithCalories;
import com.example.CateringApp.Request.CreateDietWithSize;
import com.example.CateringApp.Service.Diet.DietServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/diet")
@CrossOrigin
public class DietController {

    @Autowired
    private DietServiceImpl dietService;

    static Logger logger = Logger.getLogger(AddressController.class.getName());

    @GetMapping("get")
    public List<Diet> getListOfDiet() {
        return dietService.getListOfDiet();
    }

    @GetMapping("getByName")
    public List<Diet> getListOfDietByName(@RequestParam String name) {
        return dietService.getListOfDietByName(name);
    }

    @GetMapping("getOrdered")
    public Map<String, List<String>> getListOfDietNameWithAllVariants() {
        return dietService.getListOfDietNameWithAllVariants();
    }

    @PostMapping("saveWithCalories")
    public List<Diet> saveDietWithCalories(@Valid @RequestBody CreateDietWithCalories diet) throws CustomException {
        return dietService.saveDietWithCalories(diet);
    }

    @PostMapping("saveWithSize")
    public List<Diet> saveDietWithSize(@Valid @RequestBody CreateDietWithSize diet) throws CustomException {
        return dietService.saveDietWithSize(diet);
    }

    @PutMapping("update")
    public Diet updateDiet(@RequestParam Long id, @Valid @ModelAttribute Diet diet) throws CustomException {
        return dietService.updateDietOrThrowException(id, diet);
    }

    @DeleteMapping("delete")
    public void deleteDiet(@RequestParam String name) {
        dietService.deleteDiet(name);
    }

}
