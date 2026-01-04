package com.cabinet.dentaire.controller;

import com.cabinet.dentaire.entity.Patient;
import com.cabinet.dentaire.service.interfaces.IPatientService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")  // For Angular/React frontend
public class PatientController {

    private final IPatientService patientService;

    public PatientController(IPatientService patientService) {
        this.patientService = patientService;
    }

    // ============== CRUD Endpoints ==============

    // POST /api/patients
    @PostMapping
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        Patient savedPatient = patientService.save(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    // GET /api/patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.findAll();
        return ResponseEntity.ok(patients);
    }

    // GET /api/patients/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/patients/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id, 
            @Valid @RequestBody Patient patient) {
        Patient updatedPatient = patientService.update(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    // DELETE /api/patients/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ============== Search Endpoints ==============

    // GET /api/patients/search?name=John
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam String name) {
        List<Patient> patients = patientService.searchByName(name);
        return ResponseEntity.ok(patients);
    }

    // GET /api/patients/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(@PathVariable String email) {
        return patientService.findByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/patients/phone/{phone}
    @GetMapping("/phone/{phone}")
    public ResponseEntity<Patient> getPatientByPhone(@PathVariable String phone) {
        return patientService.findByPhone(phone)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ============== Validation Endpoints ==============

    // GET /api/patients/exists/email/{email}
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        return ResponseEntity.ok(patientService.existsByEmail(email));
    }

    // GET /api/patients/exists/phone/{phone}
    @GetMapping("/exists/phone/{phone}")
    public ResponseEntity<Boolean> checkPhoneExists(@PathVariable String phone) {
        return ResponseEntity.ok(patientService.existsByPhone(phone));
    }

    // ============== Statistics ==============

    // GET /api/patients/count
    @GetMapping("/count")
    public ResponseEntity<Long> getPatientCount() {
        return ResponseEntity.ok(patientService.count());
    }
}