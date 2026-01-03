package com.cabinet.dentaire.service.interfaces;

import com.cabinet.dentaire.entity.Patient;

import java.util.List;
import java.util.Optional;


public interface IPatientService {

    
    Optional<Patient> findById(Patient patient , Long patiendId) ;
    List<Patient> findAll();
    Patient save(Patient patient) ;
    Patient update(Patient patient , Long patientId) ;

    void delete(Long patientId) ;

    Optional<Patient> findByEmail(String email) ;

    Optional<Patient> findByPhone(String phone) ;
    
    List<Patient> searchByName(String name) ;

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    long count() ;

}