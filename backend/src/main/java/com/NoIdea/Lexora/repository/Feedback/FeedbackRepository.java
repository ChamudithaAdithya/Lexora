package com.NoIdea.Lexora.repository.Feedback;

import com.NoIdea.Lexora.model.Feedback.Feedbacks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FeedbackRepository extends JpaRepository<Feedbacks, Long> {



}

