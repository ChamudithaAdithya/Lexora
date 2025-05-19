package com.NoIdea.Lexora.dto.MentorMentee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionDTO {
    private Long id;
    private String name; // Mentee name for display
    private String date;
    private String time;
    private String status;
    private Long mentorId;
}
