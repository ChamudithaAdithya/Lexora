
package com.NoIdea.Lexora.controller.RoadMapController;

import com.NoIdea.Lexora.model.RoadMapModel.Roadmap;
import com.NoIdea.Lexora.service.RoadMapService.RoadMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadMapController {

    @Autowired
    private RoadMapService roadMapService;

    @PostMapping
    public ResponseEntity<?> createRoadMap(@RequestBody Roadmap roadMapModel) {
        try {
            Roadmap createdRoadMap = roadMapService.createRoadMap(roadMapModel);
            return new ResponseEntity<>(createdRoadMap, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Roadmap>> getAllRoadMaps() {
        List<Roadmap> roadMaps = roadMapService.getAllRoadMaps();
        return new ResponseEntity<>(roadMaps, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoadMapById(@PathVariable String id) {
        try {
            Optional<Roadmap> roadMap = roadMapService.getRoadMapById(id);
            if (roadMap.isPresent()) {
                return new ResponseEntity<>(roadMap.get(), HttpStatus.OK);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Roadmap with id " + id + " not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/rid/{rId}")
    public ResponseEntity<?> getRoadMapByRId(@PathVariable String rId) {
        try {
            Optional<Roadmap> roadMap = roadMapService.getRoadMapByRId(rId);
            if (roadMap.isPresent()) {
                return new ResponseEntity<>(roadMap.get(), HttpStatus.OK);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Roadmap with rId " + rId + " not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Roadmap>> getRoadMapsByUserId(@PathVariable Integer userId) {
        List<Roadmap> roadMaps = roadMapService.getRoadMapsByUserId(userId);
        return new ResponseEntity<>(roadMaps, HttpStatus.OK);
    }

    @GetMapping("/job/{jobName}")
    public ResponseEntity<List<Roadmap>> getRoadMapsByJobName(@PathVariable String jobName) {
        List<Roadmap> roadMaps = roadMapService.getRoadMapsByJobName(jobName);
        return new ResponseEntity<>(roadMaps, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/job/{jobName}")
    public ResponseEntity<List<Roadmap>> getRoadMapsByUserIdAndJobName(
            @PathVariable Integer userId,
            @PathVariable String jobName) {
        List<Roadmap> roadMaps = roadMapService.getRoadMapsByUserIdAndJobName(userId, jobName);
        return new ResponseEntity<>(roadMaps, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoadMap(@PathVariable String id, @RequestBody Roadmap roadMapModel) {
        try {
            Roadmap updatedRoadMap = roadMapService.updateRoadMap(id, roadMapModel);
            return new ResponseEntity<>(updatedRoadMap, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/rid/{rId}")
    public ResponseEntity<?> updateRoadMapByRId(@PathVariable String rId, @RequestBody Roadmap roadMapModel) {
        try {
            Roadmap updatedRoadMap = roadMapService.updateRoadMapByRId(rId, roadMapModel);
            return new ResponseEntity<>(updatedRoadMap, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/rid/{rId}/progress/{stepsId}")
    public ResponseEntity<?> updateProgressStatus(
            @PathVariable String rId,
            @PathVariable String stepsId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            Roadmap updatedRoadMap = roadMapService.updateProgressStatus(rId, stepsId, status, notes);
            return new ResponseEntity<>(updatedRoadMap, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update progress: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoadMap(@PathVariable String id) {
        try {
            roadMapService.deleteRoadMap(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Roadmap with id " + id + " deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/rid/{rId}")
    public ResponseEntity<?> deleteRoadMapByRId(@PathVariable String rId) {
        try {
            roadMapService.deleteRoadMapByRId(rId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Roadmap with rId " + rId + " deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete roadmap: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

