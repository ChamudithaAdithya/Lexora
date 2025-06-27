package com.NoIdea.Lexora.ServiceTest.UserTest;

import com.NoIdea.Lexora.dto.UserProfile.UserProfileResponseDTO;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.User.serviceImpl.UserEntityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserEntityServiceImplTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserEntityServiceImpl userEntityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test password encoding and saving a new user
    @Test
    void testCreateUser() {
        UserEntity user = new UserEntity();
        user.setPassword("raw");

        when(passwordEncoder.encode("raw")).thenReturn("encoded");
        when(userEntityRepository.save(any(UserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserEntity saved = userEntityService.createUser(user);

        assertEquals("encoded", saved.getPassword()); // Now expects encoded password
    }

    // Test finding a user by ID successfully
    @Test
    void testFindUserById_Found() {
        UserEntity user = new UserEntity();
        user.setUser_id(1L);

        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));

        UserEntity result = userEntityService.findUserById(1L);
        assertNotNull(result);
    }

    // Test finding a user by ID when user is not present
    @Test
    void testFindUserById_NotFound() {
        when(userEntityRepository.findById(1L)).thenReturn(Optional.empty());

        UserEntity result = userEntityService.findUserById(1L);
        assertNull(result);
    }

    // Test successful password change
    @Test
    void testChangePassword_Success() {
        UserEntity user = new UserEntity();
        user.setPassword("encoded");

        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encoded")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("newEncoded");

        ResponseEntity<String> response = userEntityService.changePassword("old", "new", 1L);
        assertEquals(200, response.getStatusCodeValue());
        verify(userEntityRepository).save(user);
    }

    // Test failed password change due to incorrect current password
    @Test
    void testChangePassword_Failure() {
        UserEntity user = new UserEntity();
        user.setPassword("encoded");

        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        ResponseEntity<String> response = userEntityService.changePassword("wrong", "new", 1L);
        assertEquals(400, response.getStatusCodeValue()); // Bad request
    }

    // Test updating user's professional information
    @Test
    void testUpdateProfessionalDetails_Success() {
        UserEntity updated = new UserEntity();
        updated.setOccupation("Dev");
        updated.setCompany("OpenAI");

        UserEntity existing = new UserEntity();
        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(existing));

        String result = userEntityService.updateProfessionalDetails(updated, 1L);
        assertEquals("Successfully Updated", result); // Update should succeed
        verify(userEntityRepository).save(existing); // Save should be triggered
    }

    // Test saving a degree certificate for verification
    // @Test
    // void testCreateVerificationRequest_Success() throws IOException {
    // MultipartFile mockFile = mock(MultipartFile.class);
    // when(mockFile.getBytes()).thenReturn("testBytes".getBytes());
    //
    // UserEntity user = new UserEntity();
    // when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));
    //
    // String result = userEntityService.createVerificationRequest(1L, mockFile);
    // assertEquals("Successfully Send the mentor verification request", result);
    // }

    // Test building the UserProfileResponseDTO with image and certificate
    @Test
    void testFindUserProfileById_WithProfileAndCertificate() {
        UserEntity user = new UserEntity();
        user.setProfile_image("image".getBytes());
        user.setDegree_certificate("cert".getBytes());
        user.setEmail("test@example.com");

        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));

        UserProfileResponseDTO profile = userEntityService.findUserProfileById(1L);
        assertTrue(profile.getProfile_image().startsWith("data:image/jpeg;base64,")); // Validate encoding
        assertTrue(profile.getDegree_certificate().startsWith("data:application/pdf;base64,")); // Validate encoding
        assertEquals("test@example.com", profile.getEmail()); // Field mapping check
    }
}
