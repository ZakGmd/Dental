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

    List<Appointment> findByPatient(Patient patient);
    
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByStatus(AppointmentEnums status);

    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatientIdAndDateTimeAfter(Long patientId, LocalDateTime dateTime);

    List<Appointment> findByStatusOrderByDateTimeAsc(AppointmentEnums status);

    // Fixed: Using native query for PostgreSQL
    @Query(value = "SELECT * FROM appointments a WHERE DATE(a.date_time) = CURRENT_DATE ORDER BY a.date_time", nativeQuery = true)
    List<Appointment> findTodaysAppointments();

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status = :status")
    List<Appointment> findByPatientAndStatus(
        @Param("patientId") Long patientId, 
        @Param("status") AppointmentEnums status
    );
}