package com.NoIdea.Lexora.model.MentorMenteeModel;

import com.NoIdea.Lexora.enums.MentorMentee.MeetingStatus;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String meeting_id;
    private String title;
    private LocalDate date;
    private LocalTime start_time;
    private LocalTime end_time;
    private LocalDateTime created_at = LocalDateTime.now();
    private String mentor;
    private String mentee;
    private MeetingStatus status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(nullable = false,name = "user_id")
    private UserEntity user;
}
