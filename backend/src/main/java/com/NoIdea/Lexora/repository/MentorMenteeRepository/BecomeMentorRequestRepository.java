package com.NoIdea.Lexora.repository.MentorMenteeRepository;

import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BecomeMentorRequestRepository extends JpaRepository<BecomeMentorRequest,Long> {
    @Query("SELECT r FROM BecomeMentorRequest r WHERE r.user.user_id = :user_id")
    List<BecomeMentorRequest> findByUserUserId(@Param("user_id") Long user_id);

}
