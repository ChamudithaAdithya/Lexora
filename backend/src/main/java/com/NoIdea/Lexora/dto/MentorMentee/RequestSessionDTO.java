package com.NoIdea.Lexora.dto.MentorMentee;

import com.NoIdea.Lexora.enums.MentorMentee.RequestSessionStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;
import com.NoIdea.Lexora.model.User.UserEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.N;

import java.time.LocalDateTime;

@Transactional
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestSessionDTO {
    private Long id;
    private String mentor_message;
    private String mentee_message;
    private LocalDateTime requested_time;
    private RequestSessionStatus status;
    private UserRequestSessionDTO mentor;
    private Long user_id;

    public RequestSessionDTO(RequestSession session) {
        this.id = session.getId();
        this.mentee_message = session.getMentee_message();
        this.mentor_message = session.getMentor_message();
        this.requested_time = session.getRequested_time();
        this.status = session.getStatus();
        this.mentor = new UserRequestSessionDTO(session.getMentor());
        this.user_id = session.getUser_id(); 
    }
}
