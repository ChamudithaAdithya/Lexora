package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.enums.MentorMentee.MeetingStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MeetingRepository;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MeetingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private UserEntityRepository userEntityRepository;

    // Mentee Show their mentor meeting requests
    @Override
    public List<MeetingDTO> findAllMeetingsByUser_id(Long user_id) {
        List<Meeting> meeting = meetingRepository.findAllApprovedMeetingsForMentorByUserId(user_id);
        return meeting.stream().map(MeetingDTO::new).collect(Collectors.toList());

    }

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public MeetingDTO createMeeting(Long user_id, Long mentee_id, Meeting meeting) {
        UserEntity user = userEntityRepository.findById(user_id).orElse(null);
        meeting.setUser(user);
        meeting.setStatus(MeetingStatus.UPCOMING);
        meeting.setMentee_id(mentee_id);
        meetingRepository.save(meeting);
        return modelMapper.map(meeting, MeetingDTO.class);
    }

    @Override
    public String updateExistingMeetingWithMeetingId(Long id) {
        try {
            Meeting meetingNew = meetingRepository.findById(id).orElse(null);
            if (meetingNew != null) {
                meetingNew.setFeedback_given(true);
                meetingRepository.save(meetingNew);
                return "Successfully Updated";
            }
            return "Failed to Update. Meeting does not exists with the given id";
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal Server Error. Please Try Again Later";
        }
    }
    @Override
    public String completeMeetingWithMeetingId(Long meetingId) {
        try {
            Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
            if (meeting != null) {
                meeting.setStatus(MeetingStatus.COMPLETED);
                meetingRepository.save(meeting);
                return "Meeting Successfully Completed";
            }
            return "Meeting not found with the given ID";
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal Server Error. Please Try Again Later";
        }
    }

    @Override
    public String deleteExistingMeetingWithMeetingId(Long id) {
        try {
            meetingRepository.deleteById(id);
            return "Meeting Successfully Deleted";
        } catch (Exception e) {
            return "Internal Server Error. Please Try Again Later";
        }
    }

    @Override
    public MeetingDTO findMeetingByMeetingId(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if (meeting != null) {
            return modelMapper.map(meeting, MeetingDTO.class);
        }
        return null;
    }
    @Override
    public List<MeetingDTO> findMeetingByMenteeId(Long menteeId){
        List<Meeting> meeting = meetingRepository.findMeetingByMenteeId(menteeId);
        return meeting.stream().map(MeetingDTO::new).collect(Collectors.toList());

    }

}
