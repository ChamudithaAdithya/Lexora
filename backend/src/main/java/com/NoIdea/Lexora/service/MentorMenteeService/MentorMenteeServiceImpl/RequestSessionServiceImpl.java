package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.MentorMentee.MeetingDTO;
import com.NoIdea.Lexora.dto.MentorMentee.RequestSessionDTO;
import com.NoIdea.Lexora.enums.MentorMentee.RequestSessionStatus;
import com.NoIdea.Lexora.model.MentorMenteeModel.RequestSession;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.RequestSessionRepo;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.RequestSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestSessionServiceImpl implements RequestSessionService {

    @Autowired
    private RequestSessionRepo requestSessionRepo;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Override
    public List<RequestSessionDTO> getAllSessionRequests(Long user_id, Long mentor_id) {
        // Fetch the user by user_id
        if (user_id == 0) {
            UserEntity user = userEntityRepository.findById(mentor_id).orElse(null);
            if (user == null) {
                return null;
            }

            // Fetch all sessions and filter by mentor
            List<RequestSession> allSessions = requestSessionRepo.findAll();

            // Filter sessions where the mentor matches the provided user_id
            List<RequestSession> filteredSessions = allSessions.stream()
                    .filter(session -> session.getMentor() != null
                            && session.getMentor().getUser_id().equals(mentor_id))
                    .collect(Collectors.toList());

            // Map to DTOs
            return filteredSessions.stream()
                    .map(RequestSessionDTO::new)
                    .collect(Collectors.toList());

        } else {
            return requestSessionRepo.findAllByUserIdNative(user_id).stream()
                    .map(RequestSessionDTO::new)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public String createSessionRequest(RequestSession requestSession) {
        try {
            UserEntity user = userEntityRepository.findById(requestSession.getUser_id()).orElse(null);
            if (user == null) {
                return "User not found";
            }
            UserEntity mentor = userEntityRepository.findById(requestSession.getMentor().getUser_id()).orElse(null);
            requestSession.setMentor(mentor);
            requestSessionRepo.save(requestSession);
            return "Successfully Send";
        } catch (Exception e) {
            e.printStackTrace();
            return "Network Error. Please Try again later";
        }
    }

    @Override
    public String updateSessionRequestStatus(Long id, String status) {
        try {
            RequestSession requestSession = requestSessionRepo.findById(id).orElse(null);
            if (requestSession == null) {
                return "Request session not found";
            }
            if (status.equals("ACCEPTED")) {
                requestSession.setStatus(RequestSessionStatus.ACCEPTED);
            } else {
                requestSession.setStatus(RequestSessionStatus.REJECTED);
            }
            requestSessionRepo.save(requestSession);
            return "Successfully Updated";
        } catch (Exception e) {
            e.printStackTrace();
            return "Network Error. Please Try again later";
        }
    }

    @Override
    public String deleteSessionRequest(Long id) {
        try {
            RequestSession requestSession = requestSessionRepo.findById(id).orElse(null);
            if (requestSession == null) {
                return "Request session not found";
            }
            requestSessionRepo.deleteById(id);
            ;
            return "Successfully Deleted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Network Error. Please Try again later";
        }
    }
}
