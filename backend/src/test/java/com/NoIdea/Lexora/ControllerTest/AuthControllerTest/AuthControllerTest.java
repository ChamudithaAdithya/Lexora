package com.NoIdea.Lexora.ControllerTest.AuthControllerTest;

import com.NoIdea.Lexora.controller.Auth.AuthController;
import com.NoIdea.Lexora.dto.UserProfile.LoginRequestDTO;
import com.NoIdea.Lexora.dto.UserProfile.LoginResponseDTO;
import com.NoIdea.Lexora.dto.UserProfile.RegistrationRequestDTO;
import com.NoIdea.Lexora.dto.UserProfile.RegistrationResponseDTO;
import com.NoIdea.Lexora.enums.User.Role;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.service.Auth.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegistrationRequestDTO registrationRequest;
    private RegistrationResponseDTO registrationResponse;
    private LoginRequestDTO loginRequest;
    private LoginResponseDTO loginResponse;

    @BeforeEach
    void setUp() {
        registrationRequest = new RegistrationRequestDTO();
        registrationRequest.setEmail("test@example.com");
        registrationRequest.setPassword("password123");

        registrationResponse = new RegistrationResponseDTO();
        registrationResponse.setMessage("Registration successful");

        loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        loginResponse = new LoginResponseDTO();
        loginResponse.setToken("sample.jwt.token");
    }

    @Test
    void testGetAllUsers() throws Exception {
        UserEntity user = new UserEntity();
        user.setUser_id(1L);
        user.setEmail("user@example.com");

        when(authService.getAllUsers()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/v1/auth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("user@example.com"));
    }

    @Test
    void testSaveUser_Success() throws Exception {
        when(authService.register(Mockito.any())).thenReturn(registrationResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void testSaveUser_Error() throws Exception {
        RegistrationResponseDTO errorResponse = new RegistrationResponseDTO();
        errorResponse.setError("Email already exists");

        when(authService.register(Mockito.any())).thenReturn(errorResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email already exists"));
    }

    @Test
    void testLogin_Success() throws Exception {
        when(authService.login(Mockito.any())).thenReturn(loginResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("sample.jwt.token"));
    }

    @Test
    void testLogin_Error() throws Exception {
        LoginResponseDTO errorResponse = new LoginResponseDTO();
        errorResponse.setError("Invalid credentials");

        when(authService.login(Mockito.any())).thenReturn(errorResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }
}
