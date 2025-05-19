package com.NoIdea.Lexora.repository.MentorMenteeRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NoIdea.Lexora.model.MentorMenteeModel.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>{
    // Find sessions by mentor ID
    @Query("SELECT s FROM Session s WHERE s.mentor.mentorId = :mentorId")
    List<Session> findByMentorId(@Param("mentorId") Long mentorId);
    
    // Count sessions by mentor ID
    @Query("SELECT COUNT(s) FROM Session s WHERE s.mentor.mentorId = :mentorId")
    Long countSessionsByMentorId(@Param("mentorId") Long mentorId);
    
    // Find sessions by mentee ID
    @Query("SELECT s FROM Session s WHERE s.mentee.menteeId = :menteeId")
    List<Session> findByMenteeId(@Param("menteeId") Long menteeId);
}