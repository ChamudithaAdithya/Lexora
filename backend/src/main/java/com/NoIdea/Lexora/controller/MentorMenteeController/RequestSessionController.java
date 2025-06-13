package com.NoIdea.Lexora.controller.MentorMenteeController;

import com.NoIdea.Lexora.dto.MentorMentee.RequestSessionDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;
import com.NoIdea.Lexora.service.MentorMenteeService.RequestSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/matchmaking/requestSession")
public class RequestSessionController {
    @Autowired
    RequestSessionService requestSessionService;


    @GetMapping("/{user_id}/{mentor_id}")
    public List<RequestSessionDTO> getAllRequestSessionsRelatedToUser(@PathVariable Long user_id,@PathVariable Long mentor_id){
        return requestSessionService.getAllSessionRequests(user_id, mentor_id);
    }

    @PostMapping()
    public String createSessionRequest(@RequestBody RequestSession requestSession){
        return requestSessionService.createSessionRequest(requestSession);
    }
}
