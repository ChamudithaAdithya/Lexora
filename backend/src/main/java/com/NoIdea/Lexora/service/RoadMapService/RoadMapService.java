package com.NoIdea.Lexora.service.RoadMapService;

import com.NoIdea.Lexora.model.RoadMapModel.Roadmap;
import com.NoIdea.Lexora.model.RoadMapModel.Roadmap.ProgressItem;
import com.NoIdea.Lexora.repository.RoadMapRepo.RoadMapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RoadMapService {

    @Autowired
    private RoadMapRepo roadMapRepo;

    public Roadmap createRoadMap(Roadmap roadMapModel) {
        if (roadMapRepo.existsByRId(roadMapModel.getrId())) {
            throw new IllegalArgumentException(
                    "Roadmap with rId " + roadMapModel.getrId() + " already exists");
        }
        return roadMapRepo.save(roadMapModel);
    }

    public List<Roadmap> getAllRoadMaps() {
        return roadMapRepo.findAll();
    }

    public Optional<Roadmap> getRoadMapById(String id) {
        return roadMapRepo.findById(id);
    }

    public Optional<Roadmap> getRoadMapByRId(String rId) {
        return roadMapRepo.findByRId(rId);
    }

    public List<Roadmap> getRoadMapsByUserId(Integer userId) {
        return roadMapRepo.findByUserId(userId);
    }

    public List<Roadmap> getRoadMapsByJobName(String jobName) {
        return roadMapRepo.findByJobName(jobName);
    }

    public List<Roadmap> getRoadMapsByUserIdAndJobName(Integer userId, String jobName) {
        return roadMapRepo.findByUserIdAndJobName(userId, jobName);
    }

    public Roadmap updateRoadMap(String id, Roadmap roadMapModel) {
        return roadMapRepo.findById(id)
                .map(existing -> {
                    roadMapModel.setId(existing.getId());
                    return roadMapRepo.save(roadMapModel);
                })
                .orElseThrow(() ->
                        new IllegalArgumentException("Roadmap with id " + id + " not found"));
    }

    public Roadmap updateRoadMapByRId(String rId, Roadmap roadMapModel) {
        return roadMapRepo.findByRId(rId)
                .map(existing -> {
                    roadMapModel.setId(existing.getId());
                    return roadMapRepo.save(roadMapModel);
                })
                .orElseThrow(() ->
                        new IllegalArgumentException("Roadmap with rId " + rId + " not found"));
    }

    public Roadmap updateProgressStatus(String rId, String stepsId, String status, String notes) {
        Roadmap roadmap = roadMapRepo.findByRId(rId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Roadmap with rId " + rId + " not found"));

        Map<String, ProgressItem> progress = roadmap.getProgress();
        if (!progress.containsKey(stepsId)) {
            throw new IllegalArgumentException("Step with ID " + stepsId + " not found in roadmap");
        }

        progress.put(stepsId, new ProgressItem(status, notes));
        roadmap.setProgress(progress);
        return roadMapRepo.save(roadmap);
    }

    public void deleteRoadMap(String id) {
        if (!roadMapRepo.existsById(id)) {
            throw new IllegalArgumentException("Roadmap with id " + id + " not found");
        }
        roadMapRepo.deleteById(id);
    }

    public void deleteRoadMapByRId(String rId) {
        if (!roadMapRepo.existsByRId(rId)) {
            throw new IllegalArgumentException("Roadmap with rId " + rId + " not found");
        }
        roadMapRepo.deleteByRId(rId);
    }
}
