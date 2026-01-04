package com.cabinet.dentaire.service.impl;

import com.cabinet.dentaire.entity.Treatment;
import com.cabinet.dentaire.repository.TreatmentRepository;
import com.cabinet.dentaire.service.interfaces.ITreatmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class TreatmentServiceImpl implements ITreatmentService {

    private final TreatmentRepository treatmentRepository;

    public TreatmentServiceImpl(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }


    @Override
    public Treatment save(Treatment treatment) {
        if (treatment.getCode() != null && existsByCode(treatment.getCode())) {
            throw new RuntimeException("Treatment code already exists: " + treatment.getCode());
        }
        return treatmentRepository.save(treatment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Treatment> findById(Long id) {
        return treatmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Treatment> findAll() {
        ArrayList<Treatment> treatments = new ArrayList<>(treatmentRepository.findAll());
        return treatments;
    }

    @Override
    public Treatment update(Long id, Treatment treatmentDetails) {
        Treatment existingTreatment = treatmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Treatment not found with id: " + id));

        existingTreatment.setName(treatmentDetails.getName());
        existingTreatment.setDescription(treatmentDetails.getDescription());
        existingTreatment.setPrice(treatmentDetails.getPrice());

        if (treatmentDetails.getCode() != null 
            && !treatmentDetails.getCode().equals(existingTreatment.getCode())) {
            if (existsByCode(treatmentDetails.getCode())) {
                throw new RuntimeException("Treatment code already exists: " + treatmentDetails.getCode());
            }
            existingTreatment.setCode(treatmentDetails.getCode());
        }

        return treatmentRepository.save(existingTreatment);
    }

    @Override
    public void delete(Long id) {
        if (!treatmentRepository.existsById(id)) {
            throw new RuntimeException("Treatment not found with id: " + id);
        }
        treatmentRepository.deleteById(id);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Treatment> findByCode(String code) {
        return treatmentRepository.findByCode(code);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Treatment> searchByName(String name) {
        ArrayList<Treatment> results = new ArrayList<>(
            treatmentRepository.findByNameContainingIgnoreCase(name)
        );
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Treatment> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        ArrayList<Treatment> results = new ArrayList<>(
            treatmentRepository.findByPriceBetween(minPrice, maxPrice)
        );
        return results;
    }


    @Override
    @Transactional(readOnly = true)
    public Map<String, Treatment> getAllTreatmentsAsMap() {
        HashMap<String, Treatment> treatmentMap = new HashMap<>();
        
        List<Treatment> treatments = treatmentRepository.findAll();
        for (Treatment treatment : treatments) {
            if (treatment.getCode() != null) {
                treatmentMap.put(treatment.getCode(), treatment);
            }
        }
        
        return treatmentMap;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getTreatmentPriceMap() {

        HashMap<String, BigDecimal> priceMap = new HashMap<>();
        
        List<Treatment> treatments = treatmentRepository.findAll();
        for (Treatment treatment : treatments) {
            if (treatment.getCode() != null) {
                priceMap.put(treatment.getCode(), treatment.getPrice());
            }
        }
        
        return priceMap;
    }


    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return treatmentRepository.existsByCode(code);
    }


    @Override
    @Transactional(readOnly = true)
    public long count() {
        return treatmentRepository.count();
    }
}