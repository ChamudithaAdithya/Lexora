package com.NoIdea.Lexora.ControllerTest.SkillGapControllerTest;

import com.NoIdea.Lexora.controller.SkillGapController.SkillScoreController;
import com.NoIdea.Lexora.dto.UserProfile.SkillScoreWithUserDTO;
import com.NoIdea.Lexora.model.SkillGapModel.SkillScore;
import com.NoIdea.Lexora.service.SkillGapService.SkillScoreService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SkillScoreController.class)
public class SkillScoreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SkillScoreService skillScoreService;

    @Autowired
    private ObjectMapper objectMapper;

    private SkillScore skillScore;

    @BeforeEach
    void setUp() {
        skillScore = new SkillScore();
        skillScore.setSkillScoreId(1);
        skillScore.setPredictedScore(85);
        skillScore.setTotalQuestions(10);
        skillScore.setJobRoleName("Backend Developer");
        skillScore.setSkillName("Java");
        skillScore.setLearningPath("Learn Spring Boot, Hibernate");
        skillScore.setCourseLinks(List.of("https://course1.com", "https://course2.com"));
    }

    @Test
    void testGetAllSkillScores() throws Exception {
        when(skillScoreService.getAllSkillScores()).thenReturn(List.of(skillScore));

        mockMvc.perform(get("/api/v1/skillScores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].predictedScore").value(85));
    }

    @Test
    void testGetSkillScoreById_Found() throws Exception {
        when(skillScoreService.getSkillScoreById(1)).thenReturn(Optional.of(skillScore));

        mockMvc.perform(get("/api/v1/skillScores/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.predictedScore").value(85));
    }

    @Test
    void testGetSkillScoreById_NotFound() throws Exception {
        when(skillScoreService.getSkillScoreById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/skillScores/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateSkillScore() throws Exception {
        when(skillScoreService.saveSkillScore(any(SkillScore.class))).thenReturn(skillScore);

        mockMvc.perform(post("/api/v1/skillScores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillScore)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skillName").value("Java"));
    }

    @Test
    void testUpdateSkillScore_Success() throws Exception {
        when(skillScoreService.updateSkillScore(any(SkillScore.class))).thenReturn(skillScore);

        mockMvc.perform(put("/api/v1/skillScores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillScore)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skillName").value("Java"));
    }

    @Test
    void testUpdateSkillScore_NotFound() throws Exception {
        when(skillScoreService.updateSkillScore(any(SkillScore.class))).thenReturn(null);

        mockMvc.perform(put("/api/v1/skillScores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillScore)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteSkillScoreById() throws Exception {
        mockMvc.perform(delete("/api/v1/skillScores/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteAllSkillScores() throws Exception {
        mockMvc.perform(delete("/api/v1/skillScores"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetUserSkillScores() throws Exception {
        SkillScoreWithUserDTO dto = new SkillScoreWithUserDTO();
        dto.setUserId(1L);
        dto.setPredictedScore(88);

        when(skillScoreService.getUserSkillScore(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/skillScores/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].score").value(88));
    }

    @Test
    void testSaveUserScore() throws Exception {
        SkillScoreWithUserDTO inputDto = new SkillScoreWithUserDTO();
        inputDto.setUserId(1L);
        inputDto.setPredictedScore(90);

        when(skillScoreService.saveUserSkillScore(eq(1L), any(SkillScoreWithUserDTO.class))).thenReturn(inputDto);

        mockMvc.perform(post("/api/v1/skillScores/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(90));
    }
}
