package com.NoIdea.Lexora.ServiceTest.MentorMenteeServiceImplTest;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.enums.MentorMentee.MeetingStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MeetingRepository;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl.MeetingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MeetingServiceImplTest {

    @InjectMocks
    private MeetingServiceImpl meetingService;

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private ModelMapper modelMapper;

    private Meeting meeting;
    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setUser_id(1L);

        meeting = new Meeting();
        meeting.setId(1L);
        meeting.setStatus(MeetingStatus.UPCOMING);
        meeting.setFeedback_given(false);
        meeting.setUser(user);
    }


    @Test
    void testFindAllMeetingsByUserId_Success() {
        when(meetingRepository.findAllApprovedMeetingsForMentorByUserId(1L)).thenReturn(List.of(meeting));

        List<MeetingDTO> result = meetingService.findAllMeetingsByUser_id(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testCreateMeeting_Success() {
        when(userEntityRepository.findById(1L)).thenReturn(Optional.of(user));
        when(meetingRepository.save(any(Meeting.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(modelMapper.map(any(Meeting.class), eq(MeetingDTO.class))).thenReturn(new MeetingDTO());

        MeetingDTO result = meetingService.createMeeting(1L, meeting);

        assertNotNull(result);
        verify(meetingRepository).save(any(Meeting.class));
    }

    @Test
    void testUpdateExistingMeetingWithMeetingId_Success() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(meetingRepository.save(any(Meeting.class))).thenReturn(meeting);

        String result = meetingService.updateExistingMeetingWithMeetingId(1L);

        assertEquals("Successfully Updated", result);
        assertTrue(meeting.getFeedback_given());
    }

    @Test
    void testUpdateExistingMeetingWithMeetingId_NotFound() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.empty());

        String result = meetingService.updateExistingMeetingWithMeetingId(1L);

        assertEquals("Failed to Update. Meeting does not exists with the given id", result);
    }

    @Test
    void testCompleteMeetingWithMeetingId_Success() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(meetingRepository.save(any(Meeting.class))).thenReturn(meeting);

        String result = meetingService.completeMeetingWithMeetingId(1L);

        assertEquals("Meeting Successfully Completed", result);
        assertEquals(MeetingStatus.COMPLETED, meeting.getStatus());
    }

    @Test
    void testCompleteMeetingWithMeetingId_NotFound() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.empty());

        String result = meetingService.completeMeetingWithMeetingId(1L);

        assertEquals("Meeting not found with the given ID", result);
    }

    @Test
    void testDeleteExistingMeetingWithMeetingId_Success() {
        doNothing().when(meetingRepository).deleteById(1L);

        String result = meetingService.deleteExistingMeetingWithMeetingId(1L);

        assertEquals("Meeting Successfully Deleted", result);
        verify(meetingRepository).deleteById(1L);
    }

    @Test
    void testDeleteExistingMeetingWithMeetingId_Exception() {
        doThrow(new RuntimeException("Database error")).when(meetingRepository).deleteById(1L);

        String result = meetingService.deleteExistingMeetingWithMeetingId(1L);

        assertEquals("Internal Server Error. Please Try Again Later", result);
    }

    @Test
    void testFindMeetingByMeetingId_Success() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(modelMapper.map(meeting, MeetingDTO.class)).thenReturn(new MeetingDTO());

        MeetingDTO result = meetingService.findMeetingByMeetingId(1L);

        assertNotNull(result);
    }

    @Test
    void testFindMeetingByMeetingId_NotFound() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.empty());

        MeetingDTO result = meetingService.findMeetingByMeetingId(1L);

        assertNull(result);
    }
}
