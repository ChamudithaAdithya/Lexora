package com.NoIdea.Lexora.controller.SkillGapController;

import com.NoIdea.Lexora.model.SkillGapModel.JobRoleEntity;
import com.NoIdea.Lexora.service.SkillGapService.JobRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/jobRole")
public class JobRoleController {
    @Autowired
    private JobRoleService jobRoleService;

    @GetMapping()
    public List<JobRoleEntity> getJobRole(){
        return jobRoleService.getJobRole();
    }
    @GetMapping("/{id}")
    public ResponseEntity<JobRoleEntity> getJobRoleById(@PathVariable int id) {
        return jobRoleService.getByJobRoleId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping()
    public List<JobRoleEntity> saveJobRole(@RequestBody List<JobRoleEntity> jobRole){
        return null;
    }
    @PutMapping()
    public List<JobRoleEntity> updateJobRole(@RequestBody List<JobRoleEntity> jobRole){
        return jobRoleService.updateJobRole(jobRole);
    }
    @DeleteMapping
    public void deleteAllJobRole(){
        jobRoleService.deleteAllJobRole();
    }
    @DeleteMapping("/{id}")
    public void deleteJobRole( @PathVariable int id){
        jobRoleService.deleteJobRole(id);
    }
}
