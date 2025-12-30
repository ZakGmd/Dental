package com.cabinet.dentaire.entity;

// JPA annotations for entity mapping
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint ;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients", uniqueConstraints= @UniqueConstraint(columnNames= {"email"}))
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {
 
    @NotBlank(message = "First name is required")
    @Size(min= 2 , max= 50 , message = "the name must be between 2 and 50 characters !")
    @Column(nullable = false , length = 50)
    private String firstName ;

    @NotBlank(message = "First name is required")
    @Size(min= 2 , max= 50 , message = "last name must be between 2 and 50 characters !")
    @Column(nullable = false , length = 50)
    private String lastName ;

    @Email(message = "Please provide a valid email")
    @Column(unique= true)
    private String email ;

    @NotBlank(message = "Please provide your number")
    @Column(nullable=false ,length= 20)
    private String phone ;

    @Past(message ="Birth date must in the past ! no cheating here xD")
    private LocalDate birthDate ;

    @Size(max = 255 , message= "Max characters of the adress must be < 255 ")
    private String address ;
}
