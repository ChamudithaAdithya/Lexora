package com.NoIdea.Lexora.repository.MentorMenteeRepository;

// import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting,Long> {
    @Query("SELECT r FROM Meeting r WHERE r.user.user_id = :user_id")
    List<Meeting> findAllApprovedMeetingsForMentorByUserId(@Param("user_id") Long user_id);
}
