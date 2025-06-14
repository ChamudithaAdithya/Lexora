package com.NoIdea.Lexora.service.FeedbackService;

import com.NoIdea.Lexora.model.Feedback.Feedbacks;
import com.NoIdea.Lexora.repository.Feedback.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackServiceImp implements FeedbackService{

    @Autowired
    public FeedbackRepository feedbackRepository;
    @Override
    public Feedbacks saveFeedBack(Feedbacks feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedbacks> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @Override
    public Feedbacks getFeedbackById(Long fid) {
        return feedbackRepository.findById(fid).orElse(null);
    }
}
