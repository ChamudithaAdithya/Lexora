package com.NoIdea.Lexora.model.PersonaMatchingModel;

import com.NoIdea.Lexora.model.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PersonaMatchingModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String No;
    private String persona;
    private String matchPrecentage;
    @Lob
    private String suggestion;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;



}
