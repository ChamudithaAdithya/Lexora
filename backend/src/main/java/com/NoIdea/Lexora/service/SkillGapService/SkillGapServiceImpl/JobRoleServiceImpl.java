package com.NoIdea.Lexora.service.SkillGapService.SkillGapServiceImpl;

import com.NoIdea.Lexora.model.SkillGapModel.JobRoleEntity;
import com.NoIdea.Lexora.model.SkillGapModel.SkillAnswer;
import com.NoIdea.Lexora.model.SkillGapModel.SkillList;
import com.NoIdea.Lexora.model.SkillGapModel.SkillQuestion;
import com.NoIdea.Lexora.repository.SkillGapRepo.JobRoleRepo;

import com.NoIdea.Lexora.service.SkillGapService.JobRoleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class JobRoleServiceImpl implements JobRoleService {

    @Autowired
    private JobRoleRepo jobRoleRepo;

    @Override
    public Optional<JobRoleEntity> getByJobRoleId(int id) {
        return jobRoleRepo.findById(id);
    }

    @Override
    public List<JobRoleEntity> getJobRole(){
        return jobRoleRepo.findAll();
    }

    @Override
    public List<JobRoleEntity> saveJobRole(List<JobRoleEntity> jobRoles){
        for (JobRoleEntity role : jobRoles) {
            if (role.getSkillLists() != null) {
                for (SkillList skill : role.getSkillLists()) {
                    if(skill.getSkillQuestions()!=null){
                        for(SkillQuestion skilquiz: skill.getSkillQuestions()){
                            if(skilquiz.getSkillAnswers()!=null){
                                for(SkillAnswer skilans: skilquiz.getSkillAnswers()){
                                    skilans.setSkillQuestion(skilquiz);
                                }
                            }skilquiz.setSkillList(skill);
                        }
                    }skill.setJobRoleEntity(role);
                }
            }
        }
        return jobRoleRepo.saveAll(jobRoles);
    }
    @Override
    public List<JobRoleEntity> updateJobRole(List<JobRoleEntity> jobRoles){
        for (JobRoleEntity role : jobRoles) {
            if (role.getSkillLists() != null) {
                for (SkillList skill : role.getSkillLists()) {
                    skill.setJobRoleEntity(role);
                }
            }
        }
        return jobRoleRepo.saveAll(jobRoles);
    }
    @Override
    public void deleteJobRole(  int id){
        jobRoleRepo.deleteById(id);
    }
    @Override
    public void deleteAllJobRole(){
        jobRoleRepo.deleteAll();
    }

    @Override
    public boolean deleteSkill(int id){
        List<JobRoleEntity> jobRoleEntities=jobRoleRepo.findAll();
        for(JobRoleEntity jobRoleEntity :jobRoleEntities){
            boolean remove=jobRoleEntity.getSkillLists().removeIf(skillList -> skillList.getSkillId()==id);
            if(remove){
                return true;
            }
        }
        return false;
    }
    @Override
    public boolean deleteQuestion(int id) {
        List<JobRoleEntity> jobRoleEntities = jobRoleRepo.findAll();
        for (JobRoleEntity jobRole : jobRoleEntities) {
            for (SkillList skillList : jobRole.getSkillLists()) {
                boolean remove = skillList.getSkillQuestions().removeIf(skillQuestion -> skillQuestion.getQuestionId() == id);
                {
                    if (remove) {
                        return true;
                    }
                }
            }

        }
        return false;
    }
    @Override
    public boolean deleteAnswer(int id){
        List<JobRoleEntity> jobRoleEntities=jobRoleRepo.findAll();
        for(JobRoleEntity jobRoleEntity:jobRoleEntities){
            for(SkillList skillList:jobRoleEntity.getSkillLists()){
                for(SkillQuestion skillQuestion: skillList.getSkillQuestions()){
                    boolean remove=skillQuestion.getSkillAnswers().removeIf(skillAnswer -> skillAnswer.getSkillAnswerId()==id);
                    if(remove){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}



