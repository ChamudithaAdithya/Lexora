package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.MentorMentee.MentorFeedbackDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.MentorFeedback;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MentorFeedbackRepo;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class MentorFeedbackServiceImpl implements MentorFeedbackService {
    @Autowired
    private MentorFeedbackRepo mentorFeedbackRepo;

    @Autowired
    private UserEntityRepository userEntityRepository;
    @Override
    public List<MentorFeedbackDTO> findAllFeedbacksByMentorId(Long mentor_id) {
        List<MentorFeedback> collect = mentorFeedbackRepo.findAllByMentorId(mentor_id);
        return collect.stream().map(MentorFeedbackDTO::new).collect(Collectors.toList());
    }

    @Override
    public String createFeedback(MentorFeedback mentorFeedback) {
        try {
            UserEntity user = userEntityRepository.findById(mentorFeedback.getUser().getUser_id()).orElse(null);
            mentorFeedback.setUser(user);
            mentorFeedbackRepo.save(mentorFeedback);
            return "Successfully Saved";
        }catch (Exception e){
            e.printStackTrace();
            return "Failed to create the feedback";
        }
    }

    @Override
    public String updateFeedback(Long id, MentorFeedback mentorFeedback) {
        try {
            MentorFeedback mentorFeedback1 = mentorFeedbackRepo.findById(id).orElse(null);
            if(mentorFeedback1 == null){
                return null;
            }
            mentorFeedback1.setUser(mentorFeedback.getUser());
            mentorFeedback1.setMentor_id(mentorFeedback1.getMentor_id());
            mentorFeedback1.setFeedback(mentorFeedback.getFeedback());
            mentorFeedback1.setRating(mentorFeedback.getRating());
            mentorFeedbackRepo.save(mentorFeedback1);
            return "Successfully Updated";
        }catch (Exception e){
            e.printStackTrace();
            return "Failed to update the feedback";
        }
    }

    @Override
    public String deleteFeedbackById(Long id) {
        try {
            mentorFeedbackRepo.deleteById(id);
            return "Successfully Deleted";
        }catch (Exception e){
            return "Failed to delete the feedback";
        }
    }
}
