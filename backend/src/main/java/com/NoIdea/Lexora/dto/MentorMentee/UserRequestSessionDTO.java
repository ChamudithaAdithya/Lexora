package com.NoIdea.Lexora.dto.MentorMentee;

import com.NoIdea.Lexora.enums.User.Role;
import com.NoIdea.Lexora.model.User.UserEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Transactional
public class UserRequestSessionDTO {
    private Long user_id;
    private String f_name;
    private String l_name;
    private String email;
    private String username;
    private Role role;

    public UserRequestSessionDTO(UserEntity menteeSession) {
        this.user_id = menteeSession.getUser_id();
        this.f_name = menteeSession.getF_name();
        this.l_name = menteeSession.getL_name();
        this.email = menteeSession.getEmail();
        this.username = menteeSession.getUsername();
        this.role = menteeSession.getRole();
    }
}
