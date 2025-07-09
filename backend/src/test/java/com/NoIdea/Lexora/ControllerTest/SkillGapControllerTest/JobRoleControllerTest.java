package com.NoIdea.Lexora.ControllerTest.SkillGapControllerTest;

import com.NoIdea.Lexora.controller.SkillGapController.JobRoleController;
import com.NoIdea.Lexora.model.SkillGapModel.JobRoleEntity;
import com.NoIdea.Lexora.service.SkillGapService.JobRoleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobRoleController.class)
class JobRoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobRoleService jobRoleService;

    @Autowired
    private ObjectMapper objectMapper;

    private JobRoleEntity jobRole;

    @BeforeEach
    void setUp() {
        jobRole = new JobRoleEntity();
        jobRole.setJobRoleId(1);
        jobRole.setJobRoleName("Software Engineer");
    }

    @Test
    void testGetJobRole() throws Exception {
        when(jobRoleService.getJobRole()).thenReturn(List.of(jobRole));

        mockMvc.perform(get("/api/v1/jobRole"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void testGetJobRoleById_Found() throws Exception {
        when(jobRoleService.getByJobRoleId(1)).thenReturn(Optional.of(jobRole));

        mockMvc.perform(get("/api/v1/jobRole/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void testGetJobRoleById_NotFound() throws Exception {
        when(jobRoleService.getByJobRoleId(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/jobRole/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testSaveJobRole() throws Exception {
        List<JobRoleEntity> jobRoles = List.of(jobRole);
        when(jobRoleService.saveJobRole(Mockito.anyList())).thenReturn(jobRoles);

        mockMvc.perform(post("/api/v1/jobRole")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jobRoles)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void testUpdateJobRole() throws Exception {
        List<JobRoleEntity> jobRoles = List.of(jobRole);
        when(jobRoleService.updateJobRole(Mockito.anyList())).thenReturn(jobRoles);

        mockMvc.perform(put("/api/v1/jobRole")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(jobRoles)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void testDeleteAllJobRole() throws Exception {
        doNothing().when(jobRoleService).deleteAllJobRole();

        mockMvc.perform(delete("/api/v1/jobRole"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteJobRole() throws Exception {
        doNothing().when(jobRoleService).deleteJobRole(1);

        mockMvc.perform(delete("/api/v1/jobRole/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteSkill() throws Exception {
        when(jobRoleService.deleteSkill(1)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/jobRole/skill/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testDeleteQuestion() throws Exception {
        when(jobRoleService.deleteQuestion(1)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/jobRole/question/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testDeleteAnswer() throws Exception {
        when(jobRoleService.deleteAnswer(1)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/jobRole/answer/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
