package com.cabinet.dentaire.controller;

import com.cabinet.dentaire.entity.Patient;
import com.cabinet.dentaire.service.interfaces.IPatientService;
import com.cabinet.dentaire.service.interfaces.IWaitingQueueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waiting-queue")
@CrossOrigin(origins = "*")
public class WaitingQueueController {

    private final IWaitingQueueService waitingQueueService;
    private final IPatientService patientService;

    public WaitingQueueController(
            IWaitingQueueService waitingQueueService, 
            IPatientService patientService) {
        this.waitingQueueService = waitingQueueService;
        this.patientService = patientService;
    }

    // ============== Queue Operations ==============

    // POST /api/waiting-queue/add/{patientId}
    @PostMapping("/add/{patientId}")
    public ResponseEntity<String> addPatientToQueue(@PathVariable Long patientId) {
        Patient patient = patientService.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        waitingQueueService.addToQueue(patient);
        return ResponseEntity.ok("Patient added to queue. Position: " + waitingQueueService.getQueueSize());
    }

    // POST /api/waiting-queue/call-next
    @PostMapping("/call-next")
    public ResponseEntity<Patient> callNextPatient() {
        Patient nextPatient = waitingQueueService.callNextPatient();
        if (nextPatient == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(nextPatient);
    }

    // GET /api/waiting-queue/peek
    @GetMapping("/peek")
    public ResponseEntity<Patient> peekNextPatient() {
        Patient nextPatient = waitingQueueService.peekNextPatient();
        if (nextPatient == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(nextPatient);
    }

    // GET /api/waiting-queue
    @GetMapping
    public ResponseEntity<List<Patient>> getWaitingList() {
        List<Patient> waitingList = waitingQueueService.getWaitingList();
        return ResponseEntity.ok(waitingList);
    }

    // ============== Queue Info ==============

    // GET /api/waiting-queue/size
    @GetMapping("/size")
    public ResponseEntity<Integer> getQueueSize() {
        return ResponseEntity.ok(waitingQueueService.getQueueSize());
    }

    // GET /api/waiting-queue/is-empty
    @GetMapping("/is-empty")
    public ResponseEntity<Boolean> isQueueEmpty() {
        return ResponseEntity.ok(waitingQueueService.isQueueEmpty());
    }

    // GET /api/waiting-queue/position/{patientId}
    @GetMapping("/position/{patientId}")
    public ResponseEntity<Integer> getPatientPosition(@PathVariable Long patientId) {
        int position = waitingQueueService.getPatientPosition(patientId);
        if (position == -1) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(position);
    }

    // ============== Queue Management ==============

    // DELETE /api/waiting-queue/remove/{patientId}
    @DeleteMapping("/remove/{patientId}")
    public ResponseEntity<String> removePatientFromQueue(@PathVariable Long patientId) {
        boolean removed = waitingQueueService.removeFromQueue(patientId);
        if (removed) {
            return ResponseEntity.ok("Patient removed from queue");
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/waiting-queue/clear
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearQueue() {
        waitingQueueService.clearQueue();
        return ResponseEntity.ok("Queue cleared");
    }
}