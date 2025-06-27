package com.NoIdea.Lexora.ServiceTest.AuthTest;


import com.NoIdea.Lexora.service.Auth.JWTService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class JWTServiceTest {

    private JWTService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JWTService(); // Initialize a fresh JWTService with a new secret key each time
    }

    @Test
    void testGenerateTokenAndExtractUsername() {
        // Verify that we can extract the correct subject (username/email) from the token
        String email = "user@example.com";
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "user");

        String token = jwtService.getJWTToken(email, claims);
        assertNotNull(token);

        String extractedUsername = jwtService.getUserName(token);
        assertEquals(email, extractedUsername);
    }

    @Test
    void testGetUserName_InvalidToken_ReturnsNull() {
        // Should gracefully return null if an invalid token is passed
        String invalidToken = "invalid.jwt.token";
        assertNull(jwtService.getUserName(invalidToken));
    }

    @Test
    void testGetFieldFromToken_InvalidToken_ReturnsNull() {
        // Should gracefully return null for field extraction from malformed token
        String invalidToken = "abc.def.ghi";
        assertNull(jwtService.getFieldFromToken(invalidToken, "role"));
    }

    @Test
    void testGetFieldFromToken_MissingClaim_ReturnsNull() {
        // Should return null if claim does not exist in token
        String email = "test@example.com";
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "mentor");

        String token = jwtService.getJWTToken(email, claims);
        assertNull(jwtService.getFieldFromToken(token, "non_existent_claim"));
    }
}

