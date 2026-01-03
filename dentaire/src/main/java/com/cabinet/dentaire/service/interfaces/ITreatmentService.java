package com.cabinet.dentaire.service.interfaces;

import com.cabinet.dentaire.entity.Treatment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ITreatmentService {

    
    Treatment save(Treatment treatment);
    
    Optional<Treatment> findById(Long id);
    
    List<Treatment> findAll();
    
    Treatment update(Long id, Treatment treatment);
    
    void delete(Long id);
    
    
    Optional<Treatment> findByCode(String code);
    
    List<Treatment> searchByName(String name);
    
    List<Treatment> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    
    // Get all treatments organized by code for quick lookup
    Map<String, Treatment> getAllTreatmentsAsMap();
    
    // Get treatment prices as a map (code -> price)
    Map<String, BigDecimal> getTreatmentPriceMap();
        
    long count();
}