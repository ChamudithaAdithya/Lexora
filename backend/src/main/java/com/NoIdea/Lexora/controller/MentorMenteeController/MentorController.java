package com.NoIdea.Lexora.controller.MentorMenteeController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NoIdea.Lexora.model.MentorMenteeModel.Mentor;
import com.NoIdea.Lexora.service.MentorMenteeService.MentorService;

@RestController
@RequestMapping("api/mentor")
@CrossOrigin(origins = "*")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    //add new mentor
    @PostMapping
    public ResponseEntity<Mentor> saveMentor(@RequestBody Mentor mentor){
        return ResponseEntity.status(HttpStatus.CREATED).body(mentorService.saveMentor(mentor));
    }

    //view all the mentors
    @GetMapping
    public ResponseEntity<List<Mentor>> viewAllMentors(){
        List<Mentor> mentors = mentorService.viewAllMentors();
        return ResponseEntity.status(HttpStatus.OK).body(mentors);
    }

    //view mentor by id
    @GetMapping("/{mentorId}")
    public ResponseEntity<Mentor> viewMentorById(@PathVariable Long mentorId){
        return ResponseEntity.status(HttpStatus.OK).body(mentorService.viewMentorById(mentorId));
    }

    //delete mentor
    @DeleteMapping("/{mentorId}")
    public ResponseEntity<String> deleteMentor(@PathVariable Long mentorId){
        mentorService.deleteMentor(mentorId);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully deleted");
    }

    //update mentor
    @PutMapping("/{mentorId}")
    public ResponseEntity<Mentor> updateMentor(@PathVariable Long mentorId, @RequestBody Mentor mentor){
        return ResponseEntity.status(HttpStatus.OK).body(mentorService.updateMentor(mentorId, mentor));
    }
    
}
