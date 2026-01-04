package com.cabinet.dentaire.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.cabinet.dentaire.entity.Patient;

public interface IPatientService {

    // ============== CRUD Operations ==============
    
    Patient save(Patient patient);
    
    Optional<Patient> findById(Long patientId);
    
    List<Patient> findAll();
    
    Patient update(Long id, Patient patient);

    void delete(Long patientId);

    // ============== Search Operations ==============
    
    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByPhone(String phone);
    
    List<Patient> searchByName(String name);
    
    // Note: findByFirstNameContaining... is NOT here!
    // It's a Repository method used internally by searchByName()

    // ============== Validation ==============
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);

    // ============== Statistics ==============
    
    long count();
}