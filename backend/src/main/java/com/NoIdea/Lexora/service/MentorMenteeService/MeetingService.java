package com.NoIdea.Lexora.service.MentorMenteeService;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MeetingService {
    public List<MeetingDTO> findAllMeetingsByUser_id(Long user_id);

    public MeetingDTO createMeeting(Long user_id, Meeting meeting);

    public String updateExistingMeetingWithMeetingId(Long id,Meeting meeting);

    public String deleteExistingMeetingWithMeetingId(Long id);
    public MeetingDTO findMeetingByMeetingId(Long meetingId);
}
