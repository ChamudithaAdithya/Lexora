package com.NoIdea.Lexora.controller.MentorMenteeController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NoIdea.Lexora.dto.MentorMentee.MenteePreferenceDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.Mentor;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl.MatchmakingService;

@RestController
@RequestMapping("/api/matchmaking")
public class MatchmakingController {

    @Autowired
    private MatchmakingService matchmakingService;

    @PostMapping
    public ResponseEntity<List<Mentor>> match(@RequestBody MenteePreferenceDTO preferences) {
        List<Mentor> matches = matchmakingService.findMatches(preferences);
        return ResponseEntity.ok(matches);
    }
}
