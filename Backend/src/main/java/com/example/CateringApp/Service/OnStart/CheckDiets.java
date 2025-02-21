package com.example.CateringApp.Service.OnStart;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.example.CateringApp.Model.Diet;
import com.example.CateringApp.Repository.DietRepository;

@Component
public class CheckDiets implements ApplicationListener<ApplicationReadyEvent>{
    @Autowired
    private DietRepository dietRepository;

    int sportCalories[] = {1200, 1500, 1800, 2000, 2500, 3000, 3500};
    int standardCalories[] = {1200, 1500, 1800, 2000, 2500};
    int ketoCalories[] = {1500, 2200, 3000};
    String juniorSize[] = {"XS", "S", "M", "XL"};
    String gainSize[] = {"X1", "X2", "X3", "X4", "X5"};
    String homeSize[] = {"M", "M-WEGE", "XL", "XL-WEGE"};
    String kuchnieSize[] = {"S", "M", "XL", "4-S", "4-M", "4-XL", "5-S", "5-M", "5-XL"};

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Random rand = new Random();
        if (dietRepository.count() == 0) {
            for (int sportCalories : sportCalories) {
                Diet sport = new Diet("SPORT", sportCalories, null, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(sport);
            }
            for (int standardCalories : standardCalories) {
                Diet standard = new Diet("STANDARD", standardCalories, null, Math.round(rand.nextDouble(100) + 1));
                Diet wege = new Diet("WEGE", standardCalories, null, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(standard);
                dietRepository.save(wege);
            }
            for (int ketoCalories : ketoCalories) {
                Diet keto = new Diet("KETO", ketoCalories, null, Math.round(rand.nextDouble(100) + 1));
                Diet lowCarb = new Diet("LOW CARB", ketoCalories, null, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(keto);
                dietRepository.save(lowCarb);
            }
            for (String juniorSize : juniorSize) {
                Diet junior = new Diet("JUNIOR", 0, juniorSize, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(junior);
            }
            for (String gainSize : gainSize) {
                Diet gain = new Diet("GAIN", 0, gainSize, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(gain);
            }
            for (String homeSize : homeSize) {
                Diet office = new Diet("OFFICE", 0, homeSize, Math.round(rand.nextDouble(100) + 1));
                Diet sok = new Diet("SOK", 0, homeSize, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(office);
                dietRepository.save(sok);
            }
            for (String kuchnieSize : kuchnieSize) {
                Diet kuchnia = new Diet("KUCHNIA-POLSKA", 0, kuchnieSize, Math.round(rand.nextDouble(100) + 1));
                dietRepository.save(kuchnia);
            }

        }
    }
    
}
