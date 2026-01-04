package com.cabinet.dentaire.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cabinet.dentaire.entity.Appointment;
import com.cabinet.dentaire.entity.Patient;
import com.cabinet.dentaire.enums.AppointmentEnums;

@Repository 
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find all appointments for a patient
    List<Appointment> findByPatient(Patient patient);
    
    // Find by patient ID
    List<Appointment> findByPatientId(Long patientId);
    
    // Find by status
    List<Appointment> findByStatus(AppointmentEnums status);

    // Find appointments between two dates
    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find upcoming appointments for a patient
    List<Appointment> findByPatientIdAndDateTimeAfter(Long patientId, LocalDateTime dateTime);

    // Find by status ordered by date
    List<Appointment> findByStatusOrderByDateTimeAsc(AppointmentEnums status);

    // Custom query for today's appointments
    @Query("SELECT a FROM Appointment a WHERE DATE(a.dateTime) = CURRENT_DATE ORDER BY a.dateTime")
    List<Appointment> findTodaysAppointments();

    // Custom query: Find appointments for a patient with specific status
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status = :status")
    List<Appointment> findByPatientAndStatus(
        @Param("patientId") Long patientId, 
        @Param("status") AppointmentEnums status
    );
}