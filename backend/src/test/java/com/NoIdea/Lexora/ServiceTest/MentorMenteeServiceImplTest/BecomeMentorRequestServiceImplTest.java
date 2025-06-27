// package com.NoIdea.Lexora.ServiceTest.MentorMenteeServiceImplTest;

// import com.NoIdea.Lexora.dto.MentorMentee.BecomeMentorRequestDTO;
// import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
// import com.NoIdea.Lexora.enums.User.Role;
// import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
// import com.NoIdea.Lexora.model.User.UserEntity;
// import com.NoIdea.Lexora.repository.MentorMenteeRepository.BecomeMentorRequestRepository;
// import com.NoIdea.Lexora.repository.User.UserEntityRepository;
// import com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl.BecomeMentorRequestServiceImpl;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;

// import java.time.LocalDateTime;
// import java.util.*;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// class BecomeMentorRequestServiceImplTest {

//     @InjectMocks
//     private BecomeMentorRequestServiceImplTest requestService;

//     @Mock
//     private BecomeMentorRequestRepository requestRepository;

//     @Mock
//     private UserEntityRepository userRepository;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void testGetBecomeMentorRequests_Success() {
//         BecomeMentorRequest request = new BecomeMentorRequest();
//         request.setId(1L);
//         request.setDateTime(LocalDateTime.now());
//         request.setVerificationStatus(VerificationStatus.ACCEPTED);

//         when(requestRepository.findById(1L)).thenReturn(Optional.of(request));

//         BecomeMentorRequest result = requestService.getBecomeMentorRequests(1L);
//         assertNotNull(result);
//         assertEquals(request.getId(), result.getId());
//         assertEquals(request.getDateTime(), result.getDateTime());
//     }

//     @Test
//     void testCreateRequest_Success() {
//         UserEntity user = new UserEntity();
//         user.setUser_id(1L);

//         when(userRepository.findById(1L)).thenReturn(Optional.of(user));

//         String result = requestService.createRequest(1L);

//         assertEquals("Successfully created and become a mentor request", result);
//         verify(requestRepository, times(1)).save(any(BecomeMentorRequest.class));
//     }

//     @Test
//     void testCreateRequest_UserNotFound() {
//         when(userRepository.findById(1L)).thenReturn(Optional.empty());

//         String result = requestService.createRequest(1L);
//         assertEquals("User Does not exists", result);
//         verify(requestRepository, never()).save(any());
//     }

//     @Test
//     void testCreateResponse_SuccessAccepted() {
//         UserEntity user = new UserEntity();
//         user.setUser_id(1L);
//         BecomeMentorRequest request = new BecomeMentorRequest();
//         request.setId(1L);
//         request.setUser(user);

//         when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
//         when(userRepository.findById(1L)).thenReturn(Optional.of(user));

//         String result = requestService.createResponse(1L, VerificationStatus.ACCEPTED);

//         assertEquals("Successfully Update with the status ACCEPTED", result);
//         assertEquals(Role.MENTOR, user.getRole());
//         assertEquals(VerificationStatus.ACCEPTED, user.getV_status());
//     }

//     @Test
//     void testCreateResponse_UserNotFound() {
//         BecomeMentorRequest request = new BecomeMentorRequest();
//         request.setId(1L);
//         request.setUser(new UserEntity());

//         when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
//         when(userRepository.findById(null)).thenReturn(Optional.empty());

//         String result = requestService.createResponse(1L, VerificationStatus.REJECTED);
//         assertTrue(result.contains("Successfully Update"));
//     }

//     @Test
//     void testCreateResponse_RequestNotFound() {
//         when(requestRepository.findById(999L)).thenReturn(Optional.empty());

//         String result = requestService.createResponse(999L, VerificationStatus.ACCEPTED);
//         assertEquals("A Request with the id: 999 does not exists", result);
//     }

//     @Test
//     void testGetAllRequestsFromTheUserId_Success() {
//         UserEntity user = new UserEntity();
//         user.setUser_id(1L);

//         BecomeMentorRequest request = new BecomeMentorRequest();
//         request.setId(1L);
//         request.setUser(user);

//         when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//         when(requestRepository.findByUserUserId(1L)).thenReturn(Collections.singletonList(request));

//         List<BecomeMentorRequestDTO> result = requestService.getAllRequestsFromTheUserId(1L);
//         assertNotNull(result);
//         assertEquals(1, result.size());
//     }

//     @Test
//     void testGetAllRequestsFromTheUserId_UserNotFound() {
//         when(userRepository.findById(1L)).thenReturn(Optional.empty());

//         List<BecomeMentorRequestDTO> result = requestService.getAllRequestsFromTheUserId(1L);
//         assertNull(result);
//     }

//     @Test
//     void testGetAllRequests_Success() {
//         UserEntity user = new UserEntity();
//         user.setUser_id(1L);

//         BecomeMentorRequest request = new BecomeMentorRequest();
//         request.setId(1L);
//         request.setUser(user);
//         request.setDateTime(LocalDateTime.now());
//         request.setVerificationStatus(VerificationStatus.ACCEPTED);

//         when(requestRepository.findAll()).thenReturn(Collections.singletonList(request));

//         List<BecomeMentorRequestDTO> result = requestService.getAllRequests();
//         assertNotNull(result);
//         assertEquals(1, result.size());
//     }

//     @Test
//     void testGetAllRequests_Failure() {
//         when(requestRepository.findAll()).thenThrow(new RuntimeException("DB error"));

//         List<BecomeMentorRequestDTO> result = requestService.getAllRequests();
//         assertNull(result);
//     }
// }
