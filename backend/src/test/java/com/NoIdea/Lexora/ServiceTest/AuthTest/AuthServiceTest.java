// package com.NoIdea.Lexora.ServiceTest.AuthTest;

// import com.NoIdea.Lexora.dto.UserProfile.LoginRequestDTO;
// import com.NoIdea.Lexora.dto.UserProfile.LoginResponseDTO;
// import com.NoIdea.Lexora.dto.UserProfile.RegistrationRequestDTO;
// import com.NoIdea.Lexora.dto.UserProfile.RegistrationResponseDTO;
// import com.NoIdea.Lexora.model.User.UserEntity;
// import com.NoIdea.Lexora.repository.User.UserEntityRepository;
// import com.NoIdea.Lexora.service.Auth.AuthService;
// import com.NoIdea.Lexora.service.Auth.JWTService;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import java.util.*;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// class AuthServiceTest {

//     @Mock
//     private UserEntityRepository userRepository;

//     @Mock
//     private PasswordEncoder passwordEncoder;

//     @Mock
//     private AuthenticationManager authenticationManager;

//     @Mock
//     private JWTService jwtService;

//     @InjectMocks
//     private AuthService authService;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this); // Initializes @Mock and injects into @InjectMocks
//     }

//     @Test
//     void testIsUserExists_WhenUserExists() {
//         // Verifies that user existence check returns true
//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new UserEntity()));
//         assertTrue(authService.isUserExists("test@example.com"));
//     }

//     @Test
//     void testIsUserExists_WhenUserDoesNotExist() {
//         // Verifies that user existence check returns false
//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
//         assertFalse(authService.isUserExists("test@example.com"));
//     }

//     @Test
//     void testRegister_WhenUserAlreadyExists() {
//         // Should return response indicating user already exists
//         RegistrationRequestDTO dto = new RegistrationRequestDTO();
//         dto.setEmail("test@example.com");
//         when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new UserEntity()));

//         RegistrationResponseDTO response = authService.register(dto);
//         assertEquals("User already exists", response.getMessage());
//     }

//     @Test
//     void testRegister_WhenNewUser() {
//         // Should register a new user successfully
//         RegistrationRequestDTO dto = new RegistrationRequestDTO();
//         dto.setEmail("new@example.com");
//         dto.setPassword("pass");
//         dto.setUsername("newuser");

//         when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
//         when(userRepository.save(any(UserEntity.class))).thenReturn(new UserEntity());

//         RegistrationResponseDTO response = authService.register(dto);
//         assertEquals("User Successfully registered", response.getMessage());
//     }

//     @Test
//     void testLogin_UserNotFound() {
//         // Should return error when user email is not in DB
//         LoginRequestDTO dto = new LoginRequestDTO();
//         dto.setEmail("missing@example.com");

//         when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

//         LoginResponseDTO response = authService.login(dto);
//         assertEquals("Invalid username and password", response.getError());
//     }

//     @Test
//     void testLogin_InvalidPassword() {
//         // Should return error if authentication fails
//         LoginRequestDTO dto = new LoginRequestDTO();
//         dto.setEmail("user@example.com");
//         dto.setPassword("wrong");

//         when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(new UserEntity()));
//         doThrow(RuntimeException.class).when(authenticationManager)
//                 .authenticate(any(UsernamePasswordAuthenticationToken.class));

//         LoginResponseDTO response = authService.login(dto);
//         assertEquals("User Not Found", response.getError());
//     }

//     @Test
//     void testLogin_Successful() {
//         // Should login and return JWT token with user_id
//         LoginRequestDTO dto = new LoginRequestDTO();
//         dto.setEmail("user@example.com");
//         dto.setPassword("password");

//         UserEntity user = new UserEntity();
//         user.setUser_id(123L);

//         when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(user));
//         when(jwtService.getJWTToken(eq(dto.getEmail()), anyMap())).thenReturn("mockToken");
//         when(jwtService.getFieldFromToken(eq("mockToken"), eq("user_id"))).thenReturn("123");

//         LoginResponseDTO response = authService.login(dto);
//         assertEquals("Success", response.getMessage());
//         assertEquals(123L, response.getUser_id());
//         assertEquals("mockToken", response.getToken());
//     }

//     @Test
//     void testSaveUser() {
//         // Should encode password and save the user
//         RegistrationRequestDTO dto = new RegistrationRequestDTO();
//         dto.setEmail("new@example.com");
//         dto.setPassword("password");
//         dto.setUsername("newuser");

//         when(passwordEncoder.encode("password")).thenReturn("encodedPass");

//         UserEntity savedUser = new UserEntity();
//         savedUser.setEmail("new@example.com");

//         when(userRepository.save(any(UserEntity.class))).thenReturn(savedUser);

//         UserEntity result = authService.saveUser(dto);
//         assertEquals("new@example.com", result.getEmail());
//     }

//     @Test
//     void testGetAllUsers() {
//         // Should fetch all users from the repository
//         List<UserEntity> mockUsers = List.of(new UserEntity(), new UserEntity());
//         when(userRepository.findAll()).thenReturn(mockUsers);

//         List<UserEntity> users = authService.getAllUsers();
//         assertEquals(2, users.size());
//     }
// }

