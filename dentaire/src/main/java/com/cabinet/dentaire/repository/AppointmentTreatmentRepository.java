package com.cabinet.dentaire.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cabinet.dentaire.entity.Appointment;
import com.cabinet.dentaire.entity.AppointmentTreatment;
import com.cabinet.dentaire.entity.Treatment;

@Repository
public interface AppointmentTreatmentRepository extends JpaRepository<AppointmentTreatment, Long> {

    // find all treatments for an appointment
    List<AppointmentTreatment> findByAppointment(Appointment appointment);
    
    List<AppointmentTreatment> findByAppointmentId(Long appointmentId);
    
    // Find all appointments that used a specific treatment
    List<AppointmentTreatment> findByTreatment(Treatment treatment);
    
    List<AppointmentTreatment> findByTreatmentId(Long treatmentId);
    
    @Query("SELECT SUM(at.priceCharged) FROM AppointmentTreatment at WHERE at.treatment.id = :treatmentId")
    Double getTotalRevenueByTreatment(@Param("treatmentId") Long treatmentId);
    
    Long countByTreatmentId(Long treatmentId);
}