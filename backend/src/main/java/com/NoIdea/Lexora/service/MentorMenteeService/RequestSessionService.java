package com.NoIdea.Lexora.service.MentorMenteeService;

import com.NoIdea.Lexora.dto.MentorMentee.RequestSessionDTO;
import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestSessionService {
    // Show the mentee all the requests send
    public List<RequestSessionDTO> getAllSessionRequests(Long user_id, Long mentor_id);

    // Create a request by mentee
    public String createSessionRequest(RequestSession requestSession);
}
