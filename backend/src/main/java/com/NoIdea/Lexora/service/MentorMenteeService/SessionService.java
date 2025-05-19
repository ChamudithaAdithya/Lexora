package com.NoIdea.Lexora.service.MentorMenteeService;

import java.util.List;

import org.springframework.stereotype.Service;

import com.NoIdea.Lexora.model.MentorMenteeModel.Session;

@Service
public interface SessionService {
    public Session createSession(Session session);
    public Session viewSessionById(Long sessionId);
    public List<Session> getAllSessions();
    public Long takeTotalSessions();
    public Long takeTotalSessionsCountById(Long mentorId);
    public String deleteSession(long sessionId);
    public List<Session> viewAllSessions();
    public Session updateSession(Long sessionId, Session session);
    public List<Session> findByMentorId(Long mentorId);
    public List<Session> findByMenteeId(Long menteeId);
}