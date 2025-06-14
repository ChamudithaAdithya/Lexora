package com.NoIdea.Lexora.service.FeedbackService;


import com.NoIdea.Lexora.model.Feedback.Feedbacks;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FeedbackService {
    Feedbacks saveFeedBack(Feedbacks feedback);
    List<Feedbacks> getAllFeedbacks();
    Feedbacks getFeedbackById(Long fid);
}

