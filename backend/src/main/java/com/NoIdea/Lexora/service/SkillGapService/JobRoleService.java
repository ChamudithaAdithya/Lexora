package com.NoIdea.Lexora.service.SkillGapService;

import com.NoIdea.Lexora.model.SkillGapModel.JobRoleEntity;

import java.util.List;
import java.util.Optional;

public interface JobRoleService {
    public Optional<JobRoleEntity> getByJobRoleId(int id) ;

    public List<JobRoleEntity> getJobRole();
    public List<JobRoleEntity> saveJobRole(List<JobRoleEntity> jobRoles);
    public List<JobRoleEntity> updateJobRole(List<JobRoleEntity> jobRoles);
    public void deleteJobRole(int id);
    public void deleteAllJobRole();
    public boolean deleteSkill(int id);
    public boolean deleteQuestion(int id);
    public boolean deleteAnswer(int id);
}
