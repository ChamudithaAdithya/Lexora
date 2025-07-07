package com.NoIdea.Lexora.ServiceTest.MentorMenteeServiceImplTest;

// import com.NoIdea.Lexora.dto.MentorMentee.MentorFeedbackDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.MentorFeedback;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MentorFeedbackRepo;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl.MentorFeedbackServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
// import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MentorFeedbackServiceImplTest {

    @Mock
    private MentorFeedbackRepo mentorFeedbackRepo;

    @Mock
    private UserEntityRepository userEntityRepository;

    @InjectMocks
    private MentorFeedbackServiceImpl mentorFeedbackService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // @Test
    // void testFindAllFeedbacksByMentorId_ReturnsList() {
    //     MentorFeedback feedback = new MentorFeedback();
    //     feedback.setMentor_id(1L);
    //     feedback.setFeedback("Great session");
    //     feedback.setRating(5);
    //     feedback.setFeedback_date_time(LocalDateTime.now());

    //     when(mentorFeedbackRepo.findAllByMentorId(1L)).thenReturn(Collections.singletonList(feedback));

    //     var result = mentorFeedbackService.findAllFeedbacksByMentorId(1L);

    //     assertEquals(1, result.size());
    //     assertEquals("Great session", result.get(0).getFeedback());
    // }

    @Test
    void testCreateFeedback_Success() {
        MentorFeedback feedback = new MentorFeedback();
        UserEntity user = new UserEntity();
        user.setUser_id(10L);

        feedback.setUser(user);

        when(userEntityRepository.findById(10L)).thenReturn(Optional.of(user));
        when(mentorFeedbackRepo.save(any(MentorFeedback.class))).thenReturn(feedback);

        String result = mentorFeedbackService.createFeedback(feedback);

        assertEquals("Successfully Saved", result);
    }

    // @Test
    // void testCreateFeedback_Failure() {
    //     MentorFeedback feedback = new MentorFeedback();
    //     feedback.setUser(new UserEntity());
    //     when(userEntityRepository.findById(null)).thenReturn(Optional.empty());

    //     String result = mentorFeedbackService.createFeedback(feedback);

    //     assertEquals("Failed to create the feedback", result);
    // }

    @Test
    void testUpdateFeedback_Success() {
        MentorFeedback existing = new MentorFeedback();
        existing.setId(1L);
        existing.setFeedback("Old feedback");

        MentorFeedback updated = new MentorFeedback();
        updated.setFeedback("Updated feedback");
        updated.setRating(4);
        updated.setUser(new UserEntity());

        when(mentorFeedbackRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(mentorFeedbackRepo.save(any(MentorFeedback.class))).thenReturn(existing);

        String result = mentorFeedbackService.updateFeedback(1L, updated);

        assertEquals("Successfully Updated", result);
        assertEquals("Updated feedback", existing.getFeedback());
    }

    @Test
    void testUpdateFeedback_NotFound() {
        when(mentorFeedbackRepo.findById(1L)).thenReturn(Optional.empty());

        String result = mentorFeedbackService.updateFeedback(1L, new MentorFeedback());

        assertNull(result);
    }

    @Test
    void testDeleteFeedbackById_Success() {
        doNothing().when(mentorFeedbackRepo).deleteById(1L);

        String result = mentorFeedbackService.deleteFeedbackById(1L);

        assertEquals("Successfully Deleted", result);
        verify(mentorFeedbackRepo, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteFeedbackById_Exception() {
        doThrow(new RuntimeException("Delete failed")).when(mentorFeedbackRepo).deleteById(1L);

        String result = mentorFeedbackService.deleteFeedbackById(1L);

        assertEquals("Failed to delete the feedback", result);
    }
}
