package com.NoIdea.Lexora.service.SkillGapService.SkillGapServiceImpl;

import com.NoIdea.Lexora.dto.UserProfile.SkillScoreWithUserDTO;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.SkillGapRepo.SkillScoreRepo;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.SkillGapService.SkillScoreService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SkillScoreServiceImpl implements SkillScoreService {
    @Autowired
    private SkillScoreRepo skillScoreRepo;

    @Autowired
    private UserEntityRepository userEntityRepository;

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
                        score.getJobRoleName(),
                        score.getSkillName(),
                        score.getLearningPath(),
                        score.getCourseLinks(),
                        user.getUser_id()

                );
                getScores.add(getScore);
            }

        }
        return getScores;
    }
    @Override
    public SkillScoreWithUserDTO saveUserSkillScore(Long id, SkillScoreWithUserDTO userScore) {
        Optional<UserEntity> userOptional = userEntityRepository.findById(id);

        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        UserEntity user = userOptional.get();
        SkillScore saved = null;

        List<SkillScore> existingScores = user.getSkillScores();
        boolean isUpdated = false;

        if (existingScores != null) {
            for (SkillScore existing : existingScores) {
                if (existing != null &&
                        existing.getJobRoleName().equals(userScore.getJobRoleName()) &&
                        existing.getSkillName().equals(userScore.getSkillName())) {

                    existing.setPredictedScore(userScore.getPredictedScore());
                    existing.setTotalQuestions(userScore.getTotalQuestions());
                    existing.setLearningPath(userScore.getLearningPath());
                    existing.setCourseLinks(userScore.getCourseLinks());

                    saved = skillScoreRepo.save(existing);
                    isUpdated = true;
                    break; // Exit loop after updating
                }
            }
        }

        if (!isUpdated) {
            SkillScore newScore = new SkillScore();
            newScore.setPredictedScore(userScore.getPredictedScore());
            newScore.setSkillName(userScore.getSkillName());
            newScore.setTotalQuestions(userScore.getTotalQuestions());
            newScore.setJobRoleName(userScore.getJobRoleName());
            newScore.setLearningPath(userScore.getLearningPath());
            newScore.setCourseLinks(userScore.getCourseLinks());
            newScore.setUserEntity(user);

            saved = skillScoreRepo.save(newScore);
        }

        return new SkillScoreWithUserDTO(
                saved.getSkillScoreId(),
                saved.getPredictedScore(),
                saved.getTotalQuestions(),
                saved.getJobRoleName(),
                saved.getSkillName(),
                saved.getLearningPath(),
                saved.getCourseLinks(),
                saved.getUserEntity().getUser_id()
        );
    }

}