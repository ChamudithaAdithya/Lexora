package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NoIdea.Lexora.exception.MentorMentee.SessionNotFoundException;
import com.NoIdea.Lexora.model.MentorMenteeModel.Mentee;
import com.NoIdea.Lexora.model.MentorMenteeModel.Mentor;
import com.NoIdea.Lexora.model.MentorMenteeModel.Session;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MenteeRepository;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.MentorRepository;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.SessionRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.SessionService;

@Service
public class SessionServiceImpl implements SessionService{
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private MenteeRepository menteeRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Override
    public Session createSession(Session session) {
        Mentor mentor = mentorRepository.findById(session.getMentor().getMentorId())
                                    .orElseThrow(() -> new RuntimeException("Mentor not found"));
        Mentee mentee = menteeRepository.findById(session.getMentee().getMenteeId())
                                    .orElseThrow(() -> new RuntimeException("Mentee not found"));

        session.setMentor(mentor);
        session.setMentee(mentee);

        return sessionRepository.save(session);
    }

    @Override
    public Session viewSessionById(Long sessionId){
        return sessionRepository.findById(sessionId)
            .orElseThrow(() -> new SessionNotFoundException("Session is not found by ID: " + sessionId));
    }

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }
    
    @Override
    public Long takeTotalSessions(){
        return sessionRepository.count();
    }

    @Override
    public Long takeTotalSessionsCountById(Long mentorId){
        // Use the custom repository method to count sessions by mentor ID
        return sessionRepository.countSessionsByMentorId(mentorId);
    }

    @Override
    public String deleteSession(long sessionId){
        // Check if session exists first
        if(!sessionRepository.existsById(sessionId)){
            throw new SessionNotFoundException("Session is not found by ID: " + sessionId);
        }
        sessionRepository.deleteById(sessionId);
        return "Session deleted successfully";
    }

    @Override
    public List<Session> viewAllSessions(){
        return sessionRepository.findAll();
    }

    @Override
    public Session updateSession(Long sessionId, Session updatedSession){
        Session existingSession = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new SessionNotFoundException("Session is not found by ID: " + sessionId));

        // Update all relevant fields from the input session
        if(updatedSession.getSessionDate() != null) {
            existingSession.setSessionDate(updatedSession.getSessionDate());
        }
        
        if(updatedSession.getSessionTime() != null) {
            existingSession.setSessionTime(updatedSession.getSessionTime());
        }
        
        if(updatedSession.getSessionLink() != null) {
            existingSession.setSessionLink(updatedSession.getSessionLink());
        }
        
        if(updatedSession.getSessionStatus() != null) {
            existingSession.setSessionStatus(updatedSession.getSessionStatus());
        }
        
        // If mentor or mentee is being updated, verify they exist
        if(updatedSession.getMentor() != null && updatedSession.getMentor().getMentorId() != null) {
            Mentor mentor = mentorRepository.findById(updatedSession.getMentor().getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
            existingSession.setMentor(mentor);
        }
        
        if(updatedSession.getMentee() != null && updatedSession.getMentee().getMenteeId() != null) {
            Mentee mentee = menteeRepository.findById(updatedSession.getMentee().getMenteeId())
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
            existingSession.setMentee(mentee);
        }

        return sessionRepository.save(existingSession);
    }

    @Override
    public List<Session> findByMentorId(Long mentorId) {
        return sessionRepository.findByMentorId(mentorId);
    }
    
    @Override
    public List<Session> findByMenteeId(Long menteeId) {
        return sessionRepository.findByMenteeId(menteeId);
    }
}