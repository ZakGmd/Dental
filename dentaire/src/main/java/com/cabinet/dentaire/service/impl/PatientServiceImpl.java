package com.cabinet.dentaire.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cabinet.dentaire.entity.Patient;
import com.cabinet.dentaire.repository.PatientRepository;
import com.cabinet.dentaire.service.interfaces.IPatientService;

@Service
@Transactional
public class PatientServiceImpl implements IPatientService {
 
    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }


    @Override
    public Patient save(Patient patient) {
        if (patient.getEmail() != null && existsByEmail(patient.getEmail())) {
            throw new RuntimeException("Email already exists: " + patient.getEmail());
        }
        if (existsByPhone(patient.getPhone())) {
            throw new RuntimeException("Phone already exists: " + patient.getPhone());
        }
        return patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> findById(Long id) {
        return patientRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> findAll() {
        // Using ArrayList (Academic Requirement)
        ArrayList<Patient> patients = new ArrayList<>(patientRepository.findAll());
        return patients;
    }

    @Override
    public Patient update(Long id, Patient patientDetails) {
        Patient existingPatient = patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        existingPatient.setFirstName(patientDetails.getFirstName());
        existingPatient.setLastName(patientDetails.getLastName());
        existingPatient.setPhone(patientDetails.getPhone());
        existingPatient.setBirthDate(patientDetails.getBirthDate());
        existingPatient.setAddress(patientDetails.getAddress());

        if (patientDetails.getEmail() != null 
            && !patientDetails.getEmail().equals(existingPatient.getEmail())) {
            if (existsByEmail(patientDetails.getEmail())) {
                throw new RuntimeException("Email already exists: " + patientDetails.getEmail());
            }
            existingPatient.setEmail(patientDetails.getEmail());
        }

        return patientRepository.save(existingPatient);
    }

    @Override
    public void delete(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> findByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> findByPhone(String phone) {
        return patientRepository.findByPhone(phone);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> searchByName(String name) {
        
        ArrayList<Patient> results = new ArrayList<>(
            patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name)
        );
        return results;
    }


    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return patientRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return patientRepository.existsByPhone(phone);
    }


    @Override
    @Transactional(readOnly = true)
    public long count() {
        return patientRepository.count();
    }
}
