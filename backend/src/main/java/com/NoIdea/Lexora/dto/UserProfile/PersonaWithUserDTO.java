package com.NoIdea.Lexora.dto.UserProfile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonaWithUserDTO {
    private int id;
    private String no;
    private String persona;
    private String matchPrecentage;
    private String suggestion;

    // User details
    private Long userId;
    private String fName;
    private String lName;
    private String email;
    private String username;
}
