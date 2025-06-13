package com.NoIdea.Lexora.dto.MentorMentee;

import com.NoIdea.Lexora.enums.MentorMentee.VerificationStatus;
import com.NoIdea.Lexora.enums.User.Role;
import com.NoIdea.Lexora.model.MentorMenteeModel.BecomeMentorRequest;
import jakarta.persistence.Lob;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Transactional
public class BecomeMentorRequestDTO {
    private Long id;
    private LocalDateTime dateTime;
    private VerificationStatus verificationStatus;
    private Long user_id;
    @Lob
    private byte[] profile_image;
    @Lob
    private byte[] degree_certificate;
    private String career;
    private String occupation;
    private String company;
    private String experience;
    private Role role;
    private VerificationStatus v_status;
    private String name;

    public BecomeMentorRequestDTO(BecomeMentorRequest request) {
        this.id = request.getId();
        this.dateTime = request.getDateTime();
        this.verificationStatus = request.getVerificationStatus();
        this.user_id = request.getUser().getUser_id();
        this.profile_image = request.getUser().getProfile_image();
        this.degree_certificate = request.getUser().getDegree_certificate();
        this.career = request.getUser().getCareer();
        this.occupation = request.getUser().getOccupation();
        this.company = request.getUser().getCompany();
        this.experience = request.getUser().getExperience();
        this.role = request.getUser().getRole();
        this.name = request.getUser().getF_name()+" "+request.getUser().getL_name();
    }
}
