package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.MentorMentee.BecomeMentorRequestDTO;
import com.NoIdea.Lexora.dto.MentorMentee.LastBecomeMentorRequestDTO;
import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.NoIdea.Lexora.enums.User.Role;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.MentorMenteeRepository.BecomeMentorRequestRepository;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.MentorMenteeService.BecomeMentorRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BecomeMentorRequestServiceImpl implements BecomeMentorRequestService {
    @Autowired
    private BecomeMentorRequestRepository becomeMentorRequestRepository;
    @Autowired
    private UserEntityRepository userEntityRepository;

    @Override
    public BecomeMentorRequest getBecomeMentorRequests(Long id) {
        BecomeMentorRequest request = becomeMentorRequestRepository.findById(id).orElse(null);
        BecomeMentorRequest request1 = new BecomeMentorRequest();
        request1.setId(request.getId());
        request1.setDateTime(request.getDateTime());
        request1.getVerificationStatus(request.getVerificationStatus(request.getVerificationStatus()));
        return request1;
    }

    @Override
    public String createRequest(Long userId) {
        BecomeMentorRequest request = new BecomeMentorRequest();
        UserEntity user = userEntityRepository.findById(userId).orElse(null);
        if (user != null) {
            request.setDateTime(LocalDateTime.now());
            request.setUser(user);
            becomeMentorRequestRepository.save(request);
            return "Successfully created and become a mentor request";
        }
        return "User Does not exists";
    }

    @Override
    public String createResponse(Long id, VerificationStatus status) {
        BecomeMentorRequest request = becomeMentorRequestRepository.findById(id).orElse(null);
        if (request != null) {
            try {
                request.setVerificationStatus(status);
                becomeMentorRequestRepository.save(request);
                UserEntity user = userEntityRepository.findById(request.getUser().getUser_id()).orElse(null);
                if (status == VerificationStatus.ACCEPTED) {
                    if (user != null) {
                        user.setV_status(status);
                        user.setRole(Role.MENTOR);
                        userEntityRepository.save(user);
                    }
                }
                return "Successfully Update with the status " + request.getVerificationStatus();
            } catch (Exception e) {
                return "Failed to update";
            }
        }
        return "A Request with the id: " + id + " does not exists";
    }

    @Override
    public LastBecomeMentorRequestDTO getAllRequestsFromTheUserId(Long UserId) {
        try {
            UserEntity user = userEntityRepository.findById(UserId).orElse(null);
            if (user != null) {
                List<BecomeMentorRequest> AllRequests = becomeMentorRequestRepository
                        .findByUserUserId(user.getUser_id());
                BecomeMentorRequest request = AllRequests.get(AllRequests.size() - 1);
                LastBecomeMentorRequestDTO lastBecomeMentorRequestDTO = new LastBecomeMentorRequestDTO(request);
                return lastBecomeMentorRequestDTO;
            } else {
                return null; 
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
    }

    // Get all become a mentor request to admin side
    @Override
    public List<BecomeMentorRequestDTO> getAllRequests() {
        try {
            List<BecomeMentorRequest> request = becomeMentorRequestRepository.findAll();
            return request.stream().map(BecomeMentorRequestDTO::new).collect(Collectors.toList());
        } catch (Exception e) {
            return null;
        }

    }
}
