package com.NoIdea.Lexora.ServiceTest.AuthTest;

import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.Auth.MyUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyUserDetailsServiceTest {

    private PasswordEncoder passwordEncoder;
    private UserEntityRepository userRepository;
    private MyUserDetailsService myUserDetailsService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userRepository = mock(UserEntityRepository.class);
        myUserDetailsService = new MyUserDetailsService(userRepository);
    }

    @Test
    void testLoadUserByUsername_UserExists() {
        // Arrange
        String rawPassword = "myPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail("test@example.com");
        userEntity.setPassword(encodedPassword);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(userEntity));

        // Act
        UserDetails userDetails = myUserDetailsService.loadUserByUsername("test@example.com");

        // Assert
        assertNotNull(userDetails);
        assertEquals("test@example.com", userDetails.getUsername());
        assertTrue(passwordEncoder.matches(rawPassword, userDetails.getPassword()));

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testLoadUserByUsername_UserDoesNotExist() {

        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        UserDetails userDetails = myUserDetailsService.loadUserByUsername("missing@example.com");
        assertNull(userDetails);
        verify(userRepository, times(1)).findByEmail("missing@example.com");
    }
}
