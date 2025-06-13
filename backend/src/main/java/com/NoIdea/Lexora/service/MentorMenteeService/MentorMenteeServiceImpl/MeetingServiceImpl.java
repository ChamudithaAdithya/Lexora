package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.enums.MentorMentee.MeetingStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MeetingRepository;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MeetingService;
import io.micrometer.observation.ObservationFilter;
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

    //Mentee Show their mentor meeting requests
    @Override
    public List<MeetingDTO> findAllMeetingsByUser_id(Long user_id) {
        List<Meeting> meeting = meetingRepository.findAllApprovedMeetingsForMentorByUserId(user_id);
        return meeting.stream().map(MeetingDTO::new).collect(Collectors.toList());

    }

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public MeetingDTO createMeeting(Long user_id, Meeting meeting) {
        UserEntity user = userEntityRepository.findById(user_id).orElse(null);
        meeting.setUser(user);
        meeting.setStatus(MeetingStatus.UPCOMING);
        meetingRepository.save(meeting);
        return modelMapper.map(meeting,MeetingDTO.class);
    }

    @Override
    public String updateExistingMeetingWithMeetingId(Long id,Meeting meeting) {
        try {
            Meeting meetingNew = meetingRepository.findById(id).orElse(null);
            if(meetingNew!=null){
                meetingNew.setDate(meeting.getDate());
                meetingNew.setId(id);
                meetingNew.setMeeting_id(meeting.getMeeting_id());
                meetingNew.setTitle(meeting.getTitle());
                meetingNew.setMentee(meeting.getMentee());
                meetingNew.setMentor(meeting.getMentor());
                meetingNew.setCreated_at(meeting.getCreated_at());
                meetingNew.setStart_time(meeting.getStart_time());
                meetingNew.setEnd_time(meeting.getEnd_time());
                meetingNew.setStatus(meeting.getStatus());
                meetingRepository.save(meetingNew);
                return "Successfully Updated";
            }
            return "Failed to Update. Meeting does not exists with the given id";
        }catch (Exception e){
            e.printStackTrace();
            return "Internal Server Error. Please Try Again Later";
        }
    }

    @Override
    public String deleteExistingMeetingWithMeetingId(Long id) {
        try {
            meetingRepository.deleteById(id);
            return "Meeting Successfully Deleted";
        }catch (Exception e){
            return "Internal Server Error. Please Try Again Later";
        }
    }

    @Override
    public MeetingDTO findMeetingByMeetingId(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if(meeting!=null){
            return modelMapper.map(meeting,MeetingDTO.class);
        }
        return null;
    }


}
