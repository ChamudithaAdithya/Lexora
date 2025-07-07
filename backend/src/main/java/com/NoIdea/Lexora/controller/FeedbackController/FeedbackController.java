package com.NoIdea.Lexora.controller.FeedbackController;

import com.NoIdea.Lexora.model.Feedback.Feedbacks;
import com.NoIdea.Lexora.service.FeedbackService.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping ("/api/feedback")
@RestController
public class FeedbackController {
    @Autowired
    public FeedbackService feedbackService;

    @PostMapping("/saveFeedback")
    public Feedbacks saveFeedBack(@RequestBody Feedbacks feedback){
        return feedbackService.saveFeedBack(feedback);
    }

    @GetMapping("/getAll")
    public List<Feedbacks> getAllFeedbacks(){
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/{fid}")
    public Feedbacks getFeedbackById(@PathVariable Long fid){
        return feedbackService.getFeedbackById(fid);
    }
}
