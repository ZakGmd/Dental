package com.cabinet.dentaire.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cabinet.dentaire.entity.Treatment;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
 
    Optional<Treatment> findByCode(String code) ;
    Optional<Treatment> findByName(String name) ;

    List<Treatment> findByNameContainingIgnoreCase(String name) ;
    List<Treatment> findByPriceLessThan(BigDecimal price); 
    List<Treatment> findByPriceBetween(BigDecimal min , BigDecimal max) ;


}