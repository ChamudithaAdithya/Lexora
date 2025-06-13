package com.NoIdea.Lexora.dto.UserProfile;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SkillScoreWithUserDTO {
    private Integer skillScoreId;


    private int predictedScore;
    private int totalQuestions;
    private String jobRoleName;
    private String skillName;
    private String learningPath;
    private List<String> courseLinks;

    private Long userId;
}
