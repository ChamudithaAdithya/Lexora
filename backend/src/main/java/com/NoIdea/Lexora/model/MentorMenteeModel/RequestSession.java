package com.NoIdea.Lexora.model.MentorMenteeModel;

import com.NoIdea.Lexora.enums.MentorMentee.RequestSessionStatus;
import com.NoIdea.Lexora.model.User.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class RequestSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long user_id;
    private String mentor_message;
    private String mentee_message;
    private LocalDateTime requested_time;
    private RequestSessionStatus status;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private UserEntity mentor;
}
