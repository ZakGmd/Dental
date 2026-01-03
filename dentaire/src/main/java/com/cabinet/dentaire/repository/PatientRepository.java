package com.cabinet.dentaire.repository;

import com.cabinet.dentaire.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository 
public interface PatientRepository extends JpaRepository<Patient , Long> {
    
    Optional<Patient> findByEmail(String email) ;
    Optional<Patient> findByPhone(String phone);

    List<Patient> findByLastName(String lastName) ;
    List<Patient> findByLastNameContainingIgnoreCase(String name) ;
    List<Patient> findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(String lastName , String FirstName) ;

    boolean existsByEmail(String email) ;
    boolean existByPhone(String phone) ;
}