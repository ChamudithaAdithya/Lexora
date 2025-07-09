package com.NoIdea.Lexora.ControllerTest.PersonaMatchingControllerTest;

import com.NoIdea.Lexora.controller.PersonaMatchingController.PersonaMatchingController;
import com.NoIdea.Lexora.dto.UserProfile.PersonaWithUserDTO;
import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PersonaMatchingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PersonaMatchingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PersonaMatchingService personaMatchingService;

    @Autowired
    private ObjectMapper objectMapper;

    private PersonaMatchingModel personaModel;
    private PersonaWithUserDTO personaDTO;

    @BeforeEach
    public void setup() {
        // Setup PersonaMatchingModel
        personaModel = new PersonaMatchingModel();
        personaModel.setId(1);
        personaModel.setNo("P01");
        personaModel.setPersona("Creative Thinker");
        personaModel.setMatchPrecentage("90%");
        personaModel.setSuggestion("You are highly creative and thrive in dynamic environments.");
        personaModel.setUserEntity(null); // Mocked or ignored for simplicity

        // Setup PersonaWithUserDTO
        personaDTO = new PersonaWithUserDTO();
        personaDTO.setId(1);
        personaDTO.setNo("P01");
        personaDTO.setPersona("Creative Thinker");
        personaDTO.setMatchPrecentage("90%");
        personaDTO.setSuggestion("You are highly creative and thrive in dynamic environments.");
        personaDTO.setUserId(100L);
        personaDTO.setFName("John");
        personaDTO.setLName("Doe");
        personaDTO.setEmail("john@example.com");
        personaDTO.setUsername("johndoe");
    }

    @Test
    public void testGetAllPersonaDetails() throws Exception {
        List<PersonaMatchingModel> personas = Arrays.asList(personaModel);
        Mockito.when(personaMatchingService.getAllPersonaDetails()).thenReturn(personas);

        mockMvc.perform(get("/api/v1/persona"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].persona").value("Creative Thinker"));
    }

    @Test
    public void testGetPersonaDetail() throws Exception {
        Mockito.when(personaMatchingService.getPersonaDetails(1)).thenReturn(Optional.of(personaModel));

        mockMvc.perform(get("/api/v1/persona/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.persona").value("Creative Thinker"))
                .andExpect(jsonPath("$.matchPrecentage").value("90%"));
    }

    @Test
    public void testUpdatePersona() throws Exception {
        Mockito.when(personaMatchingService.updatePersona(any(PersonaMatchingModel.class)))
                .thenReturn(personaModel);

        mockMvc.perform(put("/api/v1/persona")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(personaModel)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.persona").value("Creative Thinker"));
    }

    @Test
    public void testDeletePersona() throws Exception {
        mockMvc.perform(delete("/api/v1/persona"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetAllPersonaWithUserDetails() throws Exception {
        List<PersonaWithUserDTO> dtos = Arrays.asList(personaDTO);
        Mockito.when(personaMatchingService.getAllPersonaWithUserDetails(100L)).thenReturn(dtos);

        mockMvc.perform(get("/api/v1/persona/user/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].persona").value("Creative Thinker"))
                .andExpect(jsonPath("$[0].username").value("johndoe"));
    }

    @Test
    public void testSavePersonas() throws Exception {
        List<PersonaWithUserDTO> dtos = Arrays.asList(personaDTO);
        Mockito.when(personaMatchingService.savePersonaWithUser(eq(100L), any()))
                .thenReturn(dtos);

        mockMvc.perform(post("/api/v1/persona/user/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtos)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].fName").value("John"));
    }

    @Test
    public void testDeleteAllPersonasByUserId() throws Exception {
        mockMvc.perform(delete("/api/v1/persona/user/100"))
                .andExpect(status().isOk())
                .andExpect(content().string("All personas deleted for user ID: 100"));
    }
}
