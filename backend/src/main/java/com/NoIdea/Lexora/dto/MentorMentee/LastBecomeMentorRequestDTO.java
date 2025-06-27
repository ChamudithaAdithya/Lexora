package com.NoIdea.Lexora.dto.MentorMentee;

import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;

import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Transactional
public class LastBecomeMentorRequestDTO {
    private VerificationStatus verificationStatus;

    public LastBecomeMentorRequestDTO(BecomeMentorRequest becomeMentorRequest) {
        this.verificationStatus = becomeMentorRequest.getVerificationStatus();
    }
}
