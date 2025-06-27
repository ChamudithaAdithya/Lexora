package com.NoIdea.Lexora.controller.UserController;



import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.service.User.UserEntityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/professionalDetails")
public class UserEntityProfessionalDetailsController {
    private final UserEntityService userEntityService;

    public UserEntityProfessionalDetailsController(UserEntityService userEntityService) {
        this.userEntityService = userEntityService;
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> createProfessionalDetails(@RequestBody UserEntity userEntity, @PathVariable Long id){
        System.out.println(userEntity);
        String professionalUser = userEntityService.updateProfessionalDetails(userEntity,id);
        return ResponseEntity.status(HttpStatus.OK).body(professionalUser);
    }

    @PostMapping(value = "/certificateUpload/{id}")
    public ResponseEntity<String> createVerificationRequest(
            @RequestParam("certificate") MultipartFile certificate,
            @PathVariable Long id) {

        try {
            UserEntity userEntity = userEntityService.findUserById(id);
            userEntity.setDegree_certificate(certificate.getBytes());

            String verificationRequest = userEntityService.createVerificationRequest(userEntity);
            return ResponseEntity.status(HttpStatus.OK).body(verificationRequest);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("IO Error: Failed to read certificate file");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update the degree certificate");
        }
    }

}
