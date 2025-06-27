package com.NoIdea.Lexora.controller.MentorMenteeController;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import com.NoIdea.Lexora.service.MentorMenteeService.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/matchmaking/meeting")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;

    // Find Meetings By User ID Mentor
    @GetMapping("/{user_id}")
    public ResponseEntity<List<MeetingDTO>> findMeetingByUserId(@PathVariable Long user_id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(meetingService.findAllMeetingsByUser_id(user_id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Find Meetings By Mentee Id
    @GetMapping("/mentee/{mentee_id}")
    public ResponseEntity<List<MeetingDTO>> findMeetingByMenteeId(@PathVariable Long mentee_id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(meetingService.findMeetingByMenteeId(mentee_id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(0).body(null);
        }
    }

    // Find Meetings By Meeting id
    @GetMapping("/meetingId/{meetingId}")
    public ResponseEntity<MeetingDTO> findMeetingByMeetingId(@PathVariable Long meetingId) {
        System.out.println("This is the meeting id" + meetingId);
        try {
            MeetingDTO meeting = meetingService.findMeetingByMeetingId(meetingId);
            return ResponseEntity.status(HttpStatus.OK).body(meeting);
        } catch (Exception e) {
            e.getStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Mentor Create a meeting with mentor user_id
    @PostMapping("/{user_id}/{mentee_id}")
    public ResponseEntity<MeetingDTO> createAMeeting(@PathVariable Long user_id, @PathVariable Long mentee_id,
            @RequestBody Meeting meeting) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(meetingService.createMeeting(user_id, mentee_id, meeting));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update Meeting
    @PutMapping("/{id}")
    public ResponseEntity<String> updateExistingMeeting(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(meetingService.updateExistingMeetingWithMeetingId(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Please Check your Internet Connection");
        }
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<String> completeMeeting(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(meetingService.completeMeetingWithMeetingId(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Please Check your Internet Connection");
        }
    }

    // Delete Meeting
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExistingMeeting(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(meetingService.deleteExistingMeetingWithMeetingId(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Please Check your Internet Connection");
        }
    }

}
