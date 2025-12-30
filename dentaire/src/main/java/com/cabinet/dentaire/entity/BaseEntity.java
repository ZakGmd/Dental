package com.cabinet.dentaire.entity;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp ;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime ceatedAt ;

    @UpdateTimestamp
    private LocalDateTime updatedAt ;

}
