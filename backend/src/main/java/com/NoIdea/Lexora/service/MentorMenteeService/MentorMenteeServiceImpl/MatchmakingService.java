package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NoIdea.Lexora.dto.MentorMentee.MenteePreferenceDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.Mentor;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MentorRepository;

@Service
public class MatchmakingService {

    @Autowired
    private MentorRepository mentorRepository;

    public List<Mentor> findMatches(MenteePreferenceDTO preferences) {
        List<Mentor> allMentors = mentorRepository.findAll();

        return allMentors.stream()
                .filter(mentor -> mentor.getOccupation().equalsIgnoreCase(preferences.getFieldOfInterest()))
                .filter(mentor -> mentor.getDegree().equalsIgnoreCase(preferences.getDegreeLevel()))
                .filter(mentor -> mentor.getFeedbackScore() >= preferences.getMinFeedbackScore())
                .collect(Collectors.toList());
    }
}
