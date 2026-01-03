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

public interface AppointmentRepository extends JpaRepository<Appointment , Long>{

 List<Appointment> findByPatient(Patient patient) ;
 List<Appointment> findByPatientId(Long patientId) ;
 List<Appointment> findByAppointmentStatus(AppointmentEnums status) ;

 // fid appointment on a specific date !
 List<Appointment> findByDateBetwen(LocalDateTime start , LocalDateTime end ) ;

 //find upcoming app for specific patient
 List<Appointment> findByPatientAfterTime(Long patiendId , LocalDateTime dateTime) ;

 List<Appointment> findByStatusByDateAsc(AppointmentEnums status); 

 // custum queries for today's appointment 

 @Query("SELECT A FROM Appointment a WHERE DATE(a.dateTime) = CURRENT_DATE ORDER BY a.dateTime")
 List<Appointment> findTodayAppointment() ;

  @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status = :status")
    List<Appointment> findByPatientAndStatus(
        @Param("patientId") Long patientId, 
        @Param("status") AppointmentEnums status
    );


    
}