package com.cabinet.dentaire.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.cabinet.dentaire.enums.AppointmentEnums;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "appointments")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"patient", "appointmentTreatments"})
@ToString(exclude = {"patient", "appointmentTreatments"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment extends BaseEntity {

    @NotNull(message = "Patient is required")
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
    private Patient patient;

    @NotNull(message = "Appointment date and time is required")
    @Column(nullable = false)
    private LocalDateTime dateTime;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AppointmentEnums status = AppointmentEnums.SCHEDULED;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    @Column(length = 1000)
    private String notes;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"appointment", "hibernateLazyInitializer", "handler"})  // ← Added
    @Builder.Default
    private List<AppointmentTreatment> appointmentTreatments = new ArrayList<>();
}