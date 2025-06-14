package com.NoIdea.Lexora.model.User;

import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;

import com.NoIdea.Lexora.enums.User.Role;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import com.NoIdea.Lexora.model.MentorMenteeModel.MentorFeedback;
import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;
import com.NoIdea.Lexora.model.Notification;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    private String f_name;
    private String l_name;
    @Column(unique = true,nullable = false)
    private String email;
    private String bio;
    @Column(unique = true,nullable = false)
    private String username;
    @Column(unique = true,nullable = false)
    private String password;
    private String career;
    private String occupation;
    private String company;
    private String experience;
    private Role role;
    private VerificationStatus v_status;
    @Lob
    private byte[] profile_image;
    @Lob
    private byte[] degree_certificate;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<BecomeMentorRequest> becomeMentorRequest;

    @OneToMany(mappedBy = "userEntity",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PersonaMatchingModel> personaMatchingModels;

    @JsonIgnore
    @OneToMany(mappedBy = "userEntity",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<SkillScore> skillScores;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Meeting> meetings;

    @JsonIgnore
    @OneToMany(mappedBy = "mentor")
    private List<RequestSession> mentor;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<MentorFeedback> mentorFeedback;

    @JsonIgnore
    @OneToMany(mappedBy = "reciever")
    private List<Notification> notification;

}
