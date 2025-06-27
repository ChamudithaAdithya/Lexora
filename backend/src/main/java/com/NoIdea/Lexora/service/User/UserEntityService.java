package com.NoIdea.Lexora.service.User;

import com.NoIdea.Lexora.dto.UserProfile.UserProfileResponseDTO;
import com.NoIdea.Lexora.model.User.UserEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface UserEntityService {
    public UserEntity createUser(UserEntity userEntity);
    public UserEntity findUserById(Long id);
    public UserEntity updateProfileImage(UserEntity userEntity);
    public UserEntity updateUserProfile(UserEntity userEntity);

    public ResponseEntity<String> changePassword(String currentPassword, String newPassword, Long id);

    public String updateProfessionalDetails(UserEntity userEntity,Long id);

    public String createVerificationRequest(UserEntity userEntity) throws IOException;

    public UserProfileResponseDTO findUserProfileById(Long id);
}
