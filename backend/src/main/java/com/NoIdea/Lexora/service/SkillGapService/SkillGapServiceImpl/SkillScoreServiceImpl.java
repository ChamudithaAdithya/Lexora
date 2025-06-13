package com.NoIdea.Lexora.service.SkillGapService.SkillGapServiceImpl;

import com.NoIdea.Lexora.dto.UserProfile.SkillScoreWithUserDTO;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.SkillGapRepo.SkillScoreRepo;
import com.NoIdea.Lexora.service.SkillGapService.SkillScoreService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SkillScoreServiceImpl implements SkillScoreService {
    @Autowired
    private SkillScoreRepo skillScoreRepo;

    @Override
    public List<SkillScore> getAllSkillScores() {
        return skillScoreRepo.findAll();
    }

    @Override
    public Optional<SkillScore> getSkillScoreById(int id) {
        return skillScoreRepo.findById(id);
    }

    @Override
    public SkillScore saveSkillScore(SkillScore skillScore) {
        return skillScoreRepo.save(skillScore);
    }

    @Override
    public SkillScore updateSkillScore(SkillScore skillScore) {
        return skillScoreRepo.save(skillScore);
    }

    @Override
    public void deleteSkillScoreById(int id) {
        skillScoreRepo.deleteById(id);
    }

    @Override
    public void deleteAllSkillScores() {
        skillScoreRepo.deleteAll();
    }

    @Override
    public List<SkillScoreWithUserDTO> getUserSkillScore(Long id) {
        List<SkillScore> skillScore = skillScoreRepo.findAll();
        List<SkillScoreWithUserDTO> getScores = new ArrayList<>();
        for (SkillScore score : skillScore) {
            UserEntity user = score.getUserEntity();

            if (user != null && user.getUser_id().equals(id)) {
                SkillScoreWithUserDTO getScore = new SkillScoreWithUserDTO(
                        score.getSkillScoreId(),
                        score.getPredictedScore(),
                        score.getTotalQuestions(),
                        score.getLearningPath(),
                        score.getSkillName(),
                        score.getJobRoleName(),
                        score.getCourseLinks(),
                        user.getUser_id()

                );
                getScores.add(getScore);
            }

        }
        return getScores;
    }
}