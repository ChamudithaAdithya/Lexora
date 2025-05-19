package com.NoIdea.Lexora.dto.MentorMentee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionStatsDTO {
    private Long total;
    private Long pending;
    private Long completed;
    private Long rejected;
    private Long upcoming;
}
