package com.NoIdea.Lexora.controller.MentorMenteeController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NoIdea.Lexora.model.MentorMenteeModel.Mentee;
import com.NoIdea.Lexora.service.MentorMenteeService.MenteeService;

@RestController
@RequestMapping("api/mentee")
@CrossOrigin("*")
public class MenteeController {
    @Autowired
    private MenteeService menteeService;

    @PostMapping
    public Mentee saveMentee(@RequestBody Mentee mentee){
        return menteeService.saveMentee(mentee);
    }
}
