package com.NoIdea.Lexora.repository.MentorMenteeRepository;

import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestSessionRepo extends JpaRepository<RequestSession, Long> {
    @Query(value = "SELECT * FROM request_session WHERE user_id = :userId", nativeQuery = true)
    List<RequestSession> findAllByUserIdNative(@Param("userId") Long userId);
}
