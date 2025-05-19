package com.NoIdea.Lexora.model.MentorMenteeModel;

import java.util.List;

import com.NoIdea.Lexora.enums.MentorMentee.Availability;
import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mentor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mentorId;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false)
    private String degree;

    private int experience;

    private String occupation;

    private String company;

    private int feedbackScore;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    private List<String> skills;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    @OneToMany(mappedBy = "mentor")
    @JsonIgnore
    private List<Session> sessions;
}
