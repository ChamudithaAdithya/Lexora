package com.NoIdea.Lexora.service.User.serviceImpl;

import com.NoIdea.Lexora.dto.UserProfile.UserProfileResponseDTO;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.User.UserEntityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class UserEntityServiceImpl implements UserEntityService {
    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    public UserEntityServiceImpl(UserEntityRepository userEntityRepository, PasswordEncoder passwordEncoder) {
        this.userEntityRepository = userEntityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserEntity createUser(UserEntity userEntity) {
        UserEntity userEntity1 = userEntity;
        userEntity1.setPassword(passwordEncoder.encode(userEntity1.getPassword()));
        return userEntityRepository.save(userEntity);
    }

    @Override
    public UserEntity findUserById(Long id) {
        try {
            return userEntityRepository.findById(id).orElse(null);

        }catch (Exception e){
            return null;
        }

    }

    @Override
    public UserEntity updateProfileImage(UserEntity userEntity) {
        return userEntityRepository.save(userEntity);
    }

    @Override
    public UserEntity updateUserProfile(UserEntity userEntity) {
        return userEntityRepository.save(userEntity);
    }

    @Override
    public ResponseEntity<String> changePassword(String currentPassword, String newPassword, Long id) {
        UserEntity user = findUserById(id);
        if(passwordEncoder.matches(currentPassword,user.getPassword())){
            user.setPassword(passwordEncoder.encode(newPassword));
            userEntityRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).body("Successfully Changed the password");
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to change the password");
        }
    }

    @Override
    public String updateProfessionalDetails(UserEntity userEntity, Long id) {
        UserEntity user = findUserById(id);
        user.setOccupation(userEntity.getOccupation());
        user.setCompany(userEntity.getCompany());
        user.setExperience(userEntity.getExperience());
        user.setCareer(userEntity.getCareer());
        try {
            userEntityRepository.save(user);
            return "Successfully Updated";
        }catch (Exception e){
            return "Failed to update. Try again later";
        }
    }

    @Override
    public String createVerificationRequest(Long id, MultipartFile certificate) throws IOException {
        UserEntity user = findUserById(id);
        user.setDegree_certificate(certificate.getBytes());
        try {
            userEntityRepository.save(user);
            return "Successfully Send the mentor verification request";
        }catch (Exception e){
            return "Failed to send";
        }
    }

    @Override
    public UserProfileResponseDTO findUserProfileById(Long id) {
        UserProfileResponseDTO userProfile = new UserProfileResponseDTO();
        UserEntity userEntity = userEntityRepository.findById(id).orElse(null);
        String profileImage;
        String degree_certificate;

        if(userEntity!=null){
            if(userEntity.getProfile_image()!=null){
                profileImage = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(userEntity.getProfile_image());
                userProfile.setProfile_image(profileImage);
            }
            if(userEntity.getDegree_certificate()!=null){
                degree_certificate = "data:application/pdf;base64," + Base64.getEncoder().encodeToString(userEntity.getDegree_certificate());
                userProfile.setDegree_certificate(degree_certificate);
            }
            userProfile.setBio(userEntity.getBio());
            userProfile.setEmail(userEntity.getEmail());
            userProfile.setExperience(userEntity.getExperience());
            userProfile.setCompany(userEntity.getCompany());
            userProfile.setCareer(userEntity.getCareer());
            userProfile.setOccupation(userEntity.getOccupation());
            userProfile.setRole(userEntity.getRole());
            userProfile.setF_name(userEntity.getF_name());
            userProfile.setL_name(userEntity.getL_name());
            userProfile.setV_status(userEntity.getV_status());
            userProfile.setUsername(userEntity.getUsername());
            userProfile.setUser_id(userEntity.getUser_id());
        }
        return userProfile;
    }
}
