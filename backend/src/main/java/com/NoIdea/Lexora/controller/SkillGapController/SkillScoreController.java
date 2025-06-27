package com.NoIdea.Lexora.controller.SkillGapController;

import com.NoIdea.Lexora.dto.UserProfile.SkillScoreWithUserDTO;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;
import com.NoIdea.Lexora.service.SkillGapService.SkillScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@CrossOrigin


@RequestMapping("api/v1/skillScores")
public class SkillScoreController {

    @Autowired
    private SkillScoreService skillScoreService;

    // Get all skill scores
    @GetMapping
    public ResponseEntity<List<SkillScore>> getAllSkillScores() {
        List<SkillScore> scores = skillScoreService.getAllSkillScores();
        return ResponseEntity.ok(scores);
    }

    // Get a skill score by ID
    @GetMapping("/{id}")
    public ResponseEntity<SkillScore> getSkillScoreById(@PathVariable int id) {
        return skillScoreService.getSkillScoreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new skill score
    @PostMapping
    public SkillScore createSkillScore(@RequestBody SkillScore skillScore) {

        return skillScoreService.saveSkillScore(skillScore);
    }

    // Update an existing skill score by ID
    @PutMapping()
    public ResponseEntity<SkillScore> updateSkillScore(
            @RequestBody SkillScore updatedSkillScore) {
        SkillScore updated = skillScoreService.updateSkillScore(updatedSkillScore);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a skill score by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillScoreById(@PathVariable int id) {
        skillScoreService.deleteSkillScoreById(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all skill scores
    @DeleteMapping
    public ResponseEntity<Void> deleteAllSkillScores() {
        skillScoreService.deleteAllSkillScores();
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/user/{id}")
    public List<SkillScoreWithUserDTO> getUserSkillScores(@PathVariable Long id){
        return skillScoreService.getUserSkillScore(id);
    }
    @PostMapping("/user/{id}")
    public SkillScoreWithUserDTO saveUserScore(@PathVariable Long id,@RequestBody SkillScoreWithUserDTO score){
        return skillScoreService.saveUserSkillScore(id,score);
    }

}
