package com.NoIdea.Lexora.dto.MentorMentee;

import com.NoIdea.Lexora.enums.MentorMentee.MeetingStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.Meeting;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Transactional
@AllArgsConstructor
@NoArgsConstructor
public class MeetingDTO {
    private Long id;
    private String meeting_id;
    private String title;
    private LocalDate date;
    private LocalTime start_time;
    private LocalTime end_time;
    private String mentor;
    private String mentee;
    private Long user_id;
    private MeetingStatus status;
    private boolean feedbackGiven;
    private Long mentee_id;

    public MeetingDTO(Meeting meeting) {
        this.id = meeting.getId();
        this.meeting_id = meeting.getMeeting_id();
        this.mentee = meeting.getMentee();
        this.title = meeting.getTitle();
        this.date = meeting.getDate();
        this.start_time = meeting.getStart_time();
        this.end_time = meeting.getEnd_time();
        this.mentor = meeting.getMentor();
        this.user_id = meeting.getUser().getUser_id();
        this.status = meeting.getStatus();
        this.feedbackGiven = meeting.getFeedback_given();
        this.mentee_id = meeting.getMentee_id();
    }
}
