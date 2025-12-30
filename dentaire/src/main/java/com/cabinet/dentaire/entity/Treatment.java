package com.cabinet.dentaire.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "treatments")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treatment extends BaseEntity {

    @NotBlank(message = "Treatment name is required")
    @Size(min=2 , max=100 , message = "treatment name must be betwen 2 and 100 character")
    @Column(nullable = false , length = 100)
    private String name ;

    @Size(max = 1000 , message = "Treatment desc cannot exceed 1000 character")
    @Column(length = 1000)
    private String description ;

    @NotNull(message = "price is required ! ")
    @Positive(message = "Price cannot be negative")
    @Column(nullable = false , precision = 10 , scale = 2 )
    private BigDecimal price ;

    @Column(length = 20)
    private String code ;
    
}
