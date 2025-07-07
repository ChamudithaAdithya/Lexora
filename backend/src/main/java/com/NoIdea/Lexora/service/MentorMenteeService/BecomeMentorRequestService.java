package com.NoIdea.Lexora.service.MentorMenteeService;

import com.NoIdea.Lexora.dto.MentorMentee.BecomeMentorRequestDTO;
import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BecomeMentorRequestService {

    BecomeMentorRequest getBecomeMentorRequests(Long userId);
    String createRequest(Long userId);
    String createResponse(Long id, VerificationStatus status);

    List<BecomeMentorRequestDTO> getAllRequestsFromTheUserId(Long UserId);
    List<BecomeMentorRequestDTO> getAllRequests();
}
