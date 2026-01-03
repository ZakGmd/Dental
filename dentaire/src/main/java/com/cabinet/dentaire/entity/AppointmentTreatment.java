package com.cabinet.dentaire.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "appointment_treatments")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"appointment", "treatment"})
@ToString(exclude = {"appointment", "treatment"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentTreatment extends BaseEntity {

    @NotNull(message = "Appointment is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @NotNull(message = "Treatment is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treatment_id", nullable = false)
    private Treatment treatment;

    @Positive(message = "Quantity must be at least 1")
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceCharged;  

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    @Column(length = 500)
    private String notes;  
}