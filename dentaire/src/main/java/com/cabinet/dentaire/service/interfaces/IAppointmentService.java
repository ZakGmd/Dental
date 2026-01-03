package com.cabinet.dentaire.service.interfaces;

import com.cabinet.dentaire.entity.Appointment;
import com.cabinet.dentaire.enums.AppointmentEnums;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IAppointmentService {

    
    Appointment save(Appointment appointment);
    
    Optional<Appointment> findById(Long id);
    
    List<Appointment> findAll();
    
    Appointment update(Long id, Appointment appointment);
    
    void delete(Long id);
        
    Appointment updateStatus(Long id, AppointmentEnums status);
    
    List<Appointment> findByStatus(AppointmentEnums status);
    
    
    List<Appointment> findByPatientId(Long patientId);    
    List<Appointment> findUpcomingByPatientId(Long patientId);
    
    
    List<Appointment> findByDate(LocalDate date);
    List<Appointment> findTodaysAppointments();
    List<Appointment> findByDateRange(LocalDateTime start, LocalDateTime end);
        
    Map<AppointmentEnums, List<Appointment>> getAppointmentsGroupedByStatus();
    
    // Group today's appointments by hour for schedule view
    Map<Integer, List<Appointment>> getTodaysAppointmentsByHour();
    
    
    long count();
    
    long countByStatus(AppointmentEnums status);
}