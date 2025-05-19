package com.NoIdea.Lexora.controller.MentorMenteeController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NoIdea.Lexora.dto.MentorMentee.SessionStatsDTO;
import com.NoIdea.Lexora.enums.MentorMentee.SessionStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.Session;
import com.NoIdea.Lexora.service.MentorMenteeService.SessionService;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session) {
        return new ResponseEntity<>(sessionService.createSession(session), HttpStatus.CREATED);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> viewSessionById(@PathVariable Long sessionId) {
        return new ResponseEntity<>(sessionService.viewSessionById(sessionId), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        return new ResponseEntity<>(sessionService.getAllSessions(), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<SessionStatsDTO> takeTotalSessionCount(){
        List<Session> allSessions = sessionService.getAllSessions();
        
        // Calculate stats by session status
        long total = allSessions.size();
        long pending = allSessions.stream()
            .filter(s -> s.getSessionStatus() == SessionStatus.SCHEDULED)
            .count();
        long completed = allSessions.stream()
            .filter(s -> s.getSessionStatus() == SessionStatus.COMPLETED)
            .count();
        long rejected = allSessions.stream()
            .filter(s -> s.getSessionStatus() == SessionStatus.CANCELLED)
            .count();
        long upcoming = allSessions.stream()
            .filter(s -> s.getSessionStatus() == SessionStatus.ONGOING)
            .count();
        
        SessionStatsDTO stats = new SessionStatsDTO(total, pending, completed, rejected, upcoming);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/count/mentor/{mentorId}")
    public ResponseEntity<Long> getTotalSessionsByMentorId(@PathVariable Long mentorId) {
        return new ResponseEntity<>(sessionService.takeTotalSessionsCountById(mentorId), HttpStatus.OK);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
        return new ResponseEntity<>(sessionService.deleteSession(sessionId), HttpStatus.OK);
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<Session> updateSession(@PathVariable Long sessionId, @RequestBody Session session) {
        return new ResponseEntity<>(sessionService.updateSession(sessionId, session), HttpStatus.OK);
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Session>> getSessionsByMentorId(@PathVariable Long mentorId) {
        return new ResponseEntity<>(sessionService.findByMentorId(mentorId), HttpStatus.OK);
    }
    
    @GetMapping("/mentee/{menteeId}")
    public ResponseEntity<List<Session>> getSessionsByMenteeId(@PathVariable Long menteeId) {
        return new ResponseEntity<>(sessionService.findByMenteeId(menteeId), HttpStatus.OK);
    }
}