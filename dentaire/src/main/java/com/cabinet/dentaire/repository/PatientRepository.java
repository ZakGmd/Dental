package com.cabinet.dentaire.repository;

import com.cabinet.dentaire.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);
    
    Optional<Patient> findByPhone(String phone);
    
    // This method is for internal use by the service - Spring generates the query automatically
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
}