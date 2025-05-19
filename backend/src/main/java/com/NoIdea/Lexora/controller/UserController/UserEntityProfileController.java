package com.NoIdea.Lexora.controller.UserController;

import com.NoIdea.Lexora.dto.UserProfile.UserProfileResponseDTO;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.service.User.UserEntityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.NoIdea.Lexora.enums.User.Role.STUDENT;

@RestController
@RequestMapping("/api/v1/profile")
public class UserEntityProfileController {
    private final UserEntityService userEntityService;

    public UserEntityProfileController(UserEntityService userEntityService) {
        this.userEntityService = userEntityService;
    }

    // Upload User Profile Image
    @PostMapping("profileImage/{id}")
    public ResponseEntity<String> uploadImage(@RequestParam MultipartFile profileImage,@PathVariable Long id) throws IOException {
        UserEntity userEntity = new UserEntity();
        userEntity = userEntityService.findUserById(id);
        userEntity.setProfile_image(profileImage.getBytes());
        try {
            userEntityService.updateProfileImage(userEntity);
            return new ResponseEntity<>("Profile image uploaded successfully!", HttpStatus.OK);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update the profile image");
        }
    }

    // Register users
    @PostMapping("/createUser")
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity userEntity){
        UserEntity user = userEntityService.createUser(userEntity);
        user.setRole(STUDENT);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> findUserById(@PathVariable Long id) {
        UserEntity user = userEntityService.findUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping("/getProfile/{id}")
    public ResponseEntity<UserProfileResponseDTO> findUserProfileById(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(userEntityService.findUserProfileById(id));
    }

    // Update User Profile
    @PostMapping("/{id}")
    public ResponseEntity<UserEntity> updateUserProfile(@RequestBody UserEntity userEntity,@PathVariable Long id){
        System.out.println(userEntity);
        UserEntity updateUser = findUserById(id).getBody();
        updateUser.setRole(userEntity.getRole());
        updateUser.setEmail(userEntity.getEmail());
        updateUser.setBio(userEntity.getBio());
        updateUser.setCompany(userEntity.getCompany());
        updateUser.setF_name(userEntity.getF_name());
        updateUser.setL_name(userEntity.getL_name());
        updateUser.setUsername(userEntity.getUsername());

        try {
            userEntityService.updateUserProfile(updateUser);
            return ResponseEntity.status(HttpStatus.OK).body(updateUser);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateUser);
        }
    }

    // Remove Profile Image
    @PostMapping("/removeProfilePic/{id}")
    public ResponseEntity<String> removeProfilePic(@PathVariable Long id){
        UserEntity userEntity = findUserById(id).getBody();
        userEntity.setProfile_image(null);
        return ResponseEntity.status(HttpStatus.OK).body("Profile Successfully Removed");
    }

}
