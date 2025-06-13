package com.NoIdea.Lexora.model.SkillGapModel;

import com.NoIdea.Lexora.model.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SkillScore {
    @Id
    @SequenceGenerator(name = "skillscore_seq", sequenceName = "skillscore_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "skillscore_seq")
    private Integer skillScoreId;


    private int predictedScore;
    private int totalQuestions;
    //    private String learningPath;
//    private String suggestion;
    private String jobRoleName;
    private String skillName;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String learningPath;

    @ElementCollection
    private List<String> courseLinks;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;
}
