package com.cabinet.dentaire.controller;

import com.cabinet.dentaire.entity.Treatment;
import com.cabinet.dentaire.service.interfaces.ITreatmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/treatments")
@CrossOrigin(origins = "*")
public class TreatmentController {

    private final ITreatmentService treatmentService;

    public TreatmentController(ITreatmentService treatmentService) {
        this.treatmentService = treatmentService;
    }

    // ============== CRUD Endpoints ==============

    // POST /api/treatments
    @PostMapping
    public ResponseEntity<Treatment> createTreatment(@Valid @RequestBody Treatment treatment) {
        Treatment savedTreatment = treatmentService.save(treatment);
        return new ResponseEntity<>(savedTreatment, HttpStatus.CREATED);
    }

    // GET /api/treatments
    @GetMapping
    public ResponseEntity<List<Treatment>> getAllTreatments() {
        List<Treatment> treatments = treatmentService.findAll();
        return ResponseEntity.ok(treatments);
    }

    // GET /api/treatments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Treatment> getTreatmentById(@PathVariable Long id) {
        return treatmentService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/treatments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Treatment> updateTreatment(
            @PathVariable Long id, 
            @Valid @RequestBody Treatment treatment) {
        Treatment updatedTreatment = treatmentService.update(id, treatment);
        return ResponseEntity.ok(updatedTreatment);
    }

    // DELETE /api/treatments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable Long id) {
        treatmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ============== Search Endpoints ==============

    // GET /api/treatments/code/{code}
    @GetMapping("/code/{code}")
    public ResponseEntity<Treatment> getTreatmentByCode(@PathVariable String code) {
        return treatmentService.findByCode(code)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/treatments/search?name=cleaning
    @GetMapping("/search")
    public ResponseEntity<List<Treatment>> searchTreatments(@RequestParam String name) {
        List<Treatment> treatments = treatmentService.searchByName(name);
        return ResponseEntity.ok(treatments);
    }

    // GET /api/treatments/price-range?min=100&max=500
    @GetMapping("/price-range")
    public ResponseEntity<List<Treatment>> getTreatmentsByPriceRange(
            @RequestParam BigDecimal min, 
            @RequestParam BigDecimal max) {
        List<Treatment> treatments = treatmentService.findByPriceRange(min, max);
        return ResponseEntity.ok(treatments);
    }

    // ============== HashMap Endpoints (Academic Requirement) ==============

    // GET /api/treatments/map
    @GetMapping("/map")
    public ResponseEntity<Map<String, Treatment>> getTreatmentsAsMap() {
        Map<String, Treatment> treatmentMap = treatmentService.getAllTreatmentsAsMap();
        return ResponseEntity.ok(treatmentMap);
    }

    // GET /api/treatments/prices
    @GetMapping("/prices")
    public ResponseEntity<Map<String, BigDecimal>> getTreatmentPrices() {
        Map<String, BigDecimal> priceMap = treatmentService.getTreatmentPriceMap();
        return ResponseEntity.ok(priceMap);
    }

    // ============== Statistics ==============

    // GET /api/treatments/count
    @GetMapping("/count")
    public ResponseEntity<Long> getTreatmentCount() {
        return ResponseEntity.ok(treatmentService.count());
    }
}