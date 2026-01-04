package com.cabinet.dentaire.controller;

import com.cabinet.dentaire.entity.Appointment;
import com.cabinet.dentaire.enums.AppointmentEnums;
import com.cabinet.dentaire.service.interfaces.IAppointmentService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final IAppointmentService appointmentService;

    public AppointmentController(IAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ============== CRUD Endpoints ==============

    // POST /api/appointments
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment) {
        Appointment savedAppointment = appointmentService.save(appointment);
        return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
    }

    // GET /api/appointments
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.findAll();
        return ResponseEntity.ok(appointments);
    }

    // GET /api/appointments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/appointments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id, 
            @Valid @RequestBody Appointment appointment) {
        Appointment updatedAppointment = appointmentService.update(id, appointment);
        return ResponseEntity.ok(updatedAppointment);
    }

    // DELETE /api/appointments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ============== Status Management ==============

    // PATCH /api/appointments/{id}/status?status=COMPLETED
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id, 
            @RequestParam AppointmentEnums status) {
        Appointment updatedAppointment = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    // GET /api/appointments/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable AppointmentEnums status) {
        List<Appointment> appointments = appointmentService.findByStatus(status);
        return ResponseEntity.ok(appointments);
    }

    // ============== Patient Appointments ==============

    // GET /api/appointments/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.findByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    // GET /api/appointments/patient/{patientId}/upcoming
    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.findUpcomingByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    // ============== Date-based Queries ==============

    // GET /api/appointments/today
    @GetMapping("/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        List<Appointment> appointments = appointmentService.findTodaysAppointments();
        return ResponseEntity.ok(appointments);
    }

    // GET /api/appointments/date/2024-01-15
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Appointment> appointments = appointmentService.findByDate(date);
        return ResponseEntity.ok(appointments);
    }

    // GET /api/appointments/range?start=2024-01-01T00:00:00&end=2024-01-31T23:59:59
    @GetMapping("/range")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Appointment> appointments = appointmentService.findByDateRange(start, end);
        return ResponseEntity.ok(appointments);
    }

    // ============== HashMap Endpoints (Academic Requirement) ==============

    // GET /api/appointments/grouped-by-status
    @GetMapping("/grouped-by-status")
    public ResponseEntity<Map<AppointmentEnums, List<Appointment>>> getAppointmentsGroupedByStatus() {
        Map<AppointmentEnums, List<Appointment>> grouped = appointmentService.getAppointmentsGroupedByStatus();
        return ResponseEntity.ok(grouped);
    }

    // GET /api/appointments/today/by-hour
    @GetMapping("/today/by-hour")
    public ResponseEntity<Map<Integer, List<Appointment>>> getTodaysAppointmentsByHour() {
        Map<Integer, List<Appointment>> schedule = appointmentService.getTodaysAppointmentsByHour();
        return ResponseEntity.ok(schedule);
    }

    // ============== Statistics ==============

    // GET /api/appointments/count
    @GetMapping("/count")
    public ResponseEntity<Long> getAppointmentCount() {
        return ResponseEntity.ok(appointmentService.count());
    }

    // GET /api/appointments/count/status/{status}
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getAppointmentCountByStatus(@PathVariable AppointmentEnums status) {
        return ResponseEntity.ok(appointmentService.countByStatus(status));
    }
}