package com.NoIdea.Lexora.service.SkillGapService;

import com.NoIdea.Lexora.dto.UserProfile.SkillScoreWithUserDTO;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;
// import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


public interface SkillScoreService {
    List<SkillScore> getAllSkillScores();

    // Get SkillScore by ID
    Optional<SkillScore> getSkillScoreById(int id);

    // Save a new SkillScore
    SkillScore saveSkillScore(SkillScore skillScore);

    // Update existing SkillScore by ID
    SkillScore updateSkillScore(SkillScore skillScore);

    // Delete SkillScore by ID
    void deleteSkillScoreById(int id);

    // Delete all SkillScores
    void deleteAllSkillScores();
    public List<SkillScoreWithUserDTO> getUserSkillScore(Long id);
    public SkillScoreWithUserDTO saveUserSkillScore(Long id,SkillScoreWithUserDTO userScore);

}
