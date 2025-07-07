package com.NoIdea.Lexora.controller.MentorMenteeController;

import com.NoIdea.Lexora.dto.MentorMentee.BecomeMentorRequestDTO;
import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import com.NoIdea.Lexora.service.MentorMenteeService.BecomeMentorRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/request")
public class BecomeMentorRequestController {
    @Autowired
    private BecomeMentorRequestService becomeMentorRequestService;

    //Admin Show all requests
    @GetMapping("/all")
    public ResponseEntity<List<BecomeMentorRequestDTO>> getAllRequests(){
        List<BecomeMentorRequestDTO> response = becomeMentorRequestService.getAllRequests();
        HttpStatus status;
        if(response == null){
            status = HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status).body(null);
        }else {
            status = HttpStatus.OK;
            return ResponseEntity.status(status).body(response);
        }
    }

    //Admin Show Requests by user ID
    @GetMapping("/all/{userId}")
    public ResponseEntity<List<BecomeMentorRequestDTO>> getAllRequestsFromTheUserId(@PathVariable Long userId){
        List<BecomeMentorRequestDTO> response = becomeMentorRequestService.getAllRequestsFromTheUserId(userId);
        HttpStatus status;
        if(response == null){
            status = HttpStatus.NOT_FOUND;
            return ResponseEntity.status(status).body(null);
        }else {
            status = HttpStatus.OK;
            return ResponseEntity.status(status).body(response);
        }
    }


    // User Profile
    @GetMapping("/{requestID}")
    public ResponseEntity<BecomeMentorRequest> getRequests(@PathVariable Long userId){
        return ResponseEntity.status(HttpStatus.CREATED).body(becomeMentorRequestService.getBecomeMentorRequests(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<String> createRequest(@PathVariable Long userId){
        try {
            String response = becomeMentorRequestService.createRequest(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed Created the Request");
        }
    }

    @PutMapping("/{id}/{status}")
    public ResponseEntity<String> createResponse(@PathVariable Long id, @PathVariable VerificationStatus status){
        try{
            String makeStatus = becomeMentorRequestService.createResponse(id, status);
            return ResponseEntity.status(HttpStatus.CREATED).body(makeStatus);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed the request");
        }
    }


}
