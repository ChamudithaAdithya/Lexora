package com.NoIdea.Lexora.service.Auth;


import com.NoIdea.Lexora.dto.UserProfile.LoginRequestDTO;
import com.NoIdea.Lexora.dto.UserProfile.LoginResponseDTO;
import com.NoIdea.Lexora.dto.UserProfile.RegistrationRequestDTO;
import com.NoIdea.Lexora.dto.UserProfile.RegistrationResponseDTO;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {
    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    public AuthService(UserEntityRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JWTService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public List<UserEntity> getAllUsers(){
        return userRepository.findAll();
    }

    public UserEntity saveUser(RegistrationRequestDTO user){
        UserEntity newUser = new UserEntity();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setUsername(user.getUsername());
        newUser.setRole(user.getRole());
        return userRepository.save(newUser);
    }

    public LoginResponseDTO login(LoginRequestDTO loginDetails){
        if(!isUserExists(loginDetails.getEmail())){
            return new LoginResponseDTO(null,null,"Invalid username and password","error");
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDetails.getEmail(),loginDetails.getPassword()));
        }catch (Exception e){
            return new LoginResponseDTO(null,null,"User Not Found","error");
        }

        UserEntity userEmailWithData = userRepository.findByEmail(loginDetails.getEmail()).orElse(null);
        Map<String,Object> claims = new HashMap<String,Object>();
        claims.put("role","user");
        claims.put("username",loginDetails.getEmail());

        // Set User_id to jwtToken
        if(userEmailWithData != null){
            claims.put("user_id",String.valueOf(userEmailWithData.getUser_id()));
        }
        String token = jwtService.getJWTToken(loginDetails.getEmail(),claims);
        Long user_id = Long.valueOf((String) jwtService.getFieldFromToken(token,"user_id"));
        return new LoginResponseDTO(token, LocalDateTime.now(),null,"Success",user_id);
    }

    public RegistrationResponseDTO register(RegistrationRequestDTO registrationDetails){
        if(isUserExists(registrationDetails.getEmail())){
            return new RegistrationResponseDTO(null,"User already exists");
        }
        try{
            System.out.println(registrationDetails);
            saveUser(registrationDetails);
        }catch (Exception e){
            return new RegistrationResponseDTO("Invalid Credentials",null);
        }
        return new RegistrationResponseDTO(null,"User Successfully registered");
    }

    public Boolean isUserExists(String email){
        System.out.println(userRepository.findByEmail(email).isPresent());
         return userRepository.findByEmail(email).isPresent();
    }
}
