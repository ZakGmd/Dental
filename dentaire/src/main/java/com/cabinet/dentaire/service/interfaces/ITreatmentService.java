package com.cabinet.dentaire.service.interfaces;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.cabinet.dentaire.entity.Treatment;

public interface ITreatmentService {

    
    Treatment save(Treatment treatment);
    
    Optional<Treatment> findById(Long id);
    
    List<Treatment> findAll();
    
    Treatment update(Long id, Treatment treatment);
    
    void delete(Long id);
    
    
    Optional<Treatment> findByCode(String code);
    
    List<Treatment> searchByName(String name);
    
    List<Treatment> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    boolean existsByCode(String code);
    
    Map<String, Treatment> getAllTreatmentsAsMap();
    
    Map<String, BigDecimal> getTreatmentPriceMap();
    
    
    

    long count();
}