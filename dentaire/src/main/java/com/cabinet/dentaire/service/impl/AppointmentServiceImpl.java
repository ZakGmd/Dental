package com.cabinet.dentaire.service.impl;

import com.cabinet.dentaire.entity.Appointment;
import com.cabinet.dentaire.enums.AppointmentEnums;
import com.cabinet.dentaire.repository.AppointmentRepository;
import com.cabinet.dentaire.service.interfaces.IAppointmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AppointmentServiceImpl implements IAppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }


    @Override
    public Appointment save(Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus(AppointmentEnums.SCHEDULED);
        }
        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findAll() {
        ArrayList<Appointment> appointments = new ArrayList<>(appointmentRepository.findAll());
        return appointments;
    }

    @Override
    public Appointment update(Long id, Appointment appointmentDetails) {
        Appointment existingAppointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        existingAppointment.setDateTime(appointmentDetails.getDateTime());
        existingAppointment.setStatus(appointmentDetails.getStatus());
        existingAppointment.setNotes(appointmentDetails.getNotes());

        return appointmentRepository.save(existingAppointment);
    }

    @Override
    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }


    @Override
    public Appointment updateStatus(Long id, AppointmentEnums status) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findByStatus(AppointmentEnums status) {

        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findByStatus(status)
        );
        return appointments;
    }


    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findByPatientId(Long patientId) {
        // Fixed: removed semicolon inside parentheses
        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findByPatientId(patientId)
        );
        return appointments;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findUpcomingByPatientId(Long patientId) {

        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findByPatientIdAndDateTimeAfter(patientId, LocalDateTime.now())
        );
        return appointments;
    }

    // ============== Date-based Queries ==============

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        // Fixed: removed semicolon inside parentheses
        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findByDateTimeBetween(startOfDay, endOfDay)
        );
        return appointments;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findTodaysAppointments() {
        // Fixed: removed semicolon inside parentheses
        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findTodaysAppointments()
        );
        return appointments;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findByDateRange(LocalDateTime start, LocalDateTime end) {
        // Fixed: removed semicolon inside parentheses
        ArrayList<Appointment> appointments = new ArrayList<>(
            appointmentRepository.findByDateTimeBetween(start, end)
        );
        return appointments;
    }

    // ============== HashMap Operations (Academic Requirement) ==============

    @Override
    @Transactional(readOnly = true)
    public Map<AppointmentEnums, List<Appointment>> getAppointmentsGroupedByStatus() {
        HashMap<AppointmentEnums, List<Appointment>> groupedAppointments = new HashMap<>();
        
        // Initialize all statuses with empty lists
        for (AppointmentEnums status : AppointmentEnums.values()) {
            groupedAppointments.put(status, new ArrayList<>());
        }
        
        // Group appointments by status
        List<Appointment> allAppointments = appointmentRepository.findAll();
        for (Appointment appointment : allAppointments) {
            groupedAppointments.get(appointment.getStatus()).add(appointment);
        }
        
        return groupedAppointments;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, List<Appointment>> getTodaysAppointmentsByHour() {
        HashMap<Integer, List<Appointment>> scheduleByHour = new HashMap<>();
        
        // Initialize hours (8 AM to 6 PM)
        for (int hour = 8; hour <= 18; hour++) {
            scheduleByHour.put(hour, new ArrayList<>());
        }
        
        // Group today's appointments by hour
        List<Appointment> todaysAppointments = appointmentRepository.findTodaysAppointments();
        for (Appointment appointment : todaysAppointments) {
            int hour = appointment.getDateTime().getHour();
            if (scheduleByHour.containsKey(hour)) {
                scheduleByHour.get(hour).add(appointment);
            }
        }
        
        return scheduleByHour;
    }

    // ============== Statistics ==============

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return appointmentRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(AppointmentEnums status) {
        return appointmentRepository.findByStatus(status).size();
    }
}