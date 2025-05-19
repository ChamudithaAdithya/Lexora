package com.NoIdea.Lexora.dto.MentorMentee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MenteePreferenceDTO {
    private String fieldOfInterest;
    private String degreeLevel;
    private String educationLevel;
    private String personality;
    private String experienceLevel;
    private Integer minFeedbackScore;
}
