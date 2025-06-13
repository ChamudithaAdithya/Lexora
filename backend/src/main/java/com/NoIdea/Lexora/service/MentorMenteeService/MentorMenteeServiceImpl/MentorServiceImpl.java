package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NoIdea.Lexora.exception.MentorMentee.MentorNotFoundException;
import com.NoIdea.Lexora.model.MentorMenteeModel.Mentor;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MentorRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorService;

@Service
public class MentorServiceImpl implements MentorService{
    @Autowired
    private MentorRepository mentorRepository;

    @Override
    public Mentor saveMentor(Mentor mentor) {
        return mentorRepository.save(mentor);
    }

    @Override
    public void deleteMentor(Long mentorId){
        if (mentorRepository.findById(mentorId) == null){
            throw new MentorNotFoundException("Mentor not found by "+mentorId);
        }
        else{
            mentorRepository.deleteById(mentorId);
        }
    }

    @Override
    public List<Mentor> viewAllMentors() {
        List<Mentor> mentors = mentorRepository.findAll();
        return mentors;
    }

    @Override
    public Mentor viewMentorById(Long mentorId) {
        Mentor mentor = mentorRepository.findById(mentorId)
            .orElseThrow(()->new MentorNotFoundException("Mentor not found by " + mentorId));
        return mentor;
    }

    @Override
    public Mentor updateMentor(Long mentorId, Mentor mentor) {
        Mentor existingMentor = mentorRepository.findById(mentorId).orElseThrow();
        if (existingMentor == null){
            throw new MentorNotFoundException("Mentor is not found by " + mentorId);
        }else{
            existingMentor.setName(mentor.getName());
            existingMentor.setEmail(mentor.getEmail());
            existingMentor.setPassword(mentor.getPassword());
            existingMentor.setOccupation(mentor.getOccupation());
            existingMentor.setCompany(mentor.getCompany());
            existingMentor.setSkills(mentor.getSkills());
            existingMentor.setAvailability(mentor.getAvailability());
            existingMentor.setCompany(mentor.getCompany());
            existingMentor.setExperience(mentor.getExperience());
            existingMentor.setVerificationStatus(mentor.getVerificationStatus());
        }
        return existingMentor;
    }

}
