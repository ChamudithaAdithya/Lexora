package com.NoIdea.Lexora.ServiceTest.RoadmapServiceTest;

import com.NoIdea.Lexora.model.RoadMapModel.Roadmap;
import com.NoIdea.Lexora.model.RoadMapModel.Roadmap.ProgressItem;
import com.NoIdea.Lexora.repository.RoadMapRepo.RoadMapRepo;
import com.NoIdea.Lexora.service.RoadMapService.RoadMapService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoadMapServiceTest {

    @InjectMocks
    private RoadMapService roadMapService;

    @Mock
    private RoadMapRepo roadMapRepo;

    private Roadmap sampleRoadmap;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleRoadmap = new Roadmap();
        sampleRoadmap.setId("1");
        sampleRoadmap.setrId("RID123");
        sampleRoadmap.setUserId(10);
        sampleRoadmap.setJobName("Engineer");
        sampleRoadmap.setProgress(new HashMap<>());
    }

    // Test successful creation of a new roadmap
    @Test
    void testCreateRoadMapSuccess() {
        when(roadMapRepo.existsByRId("RID123")).thenReturn(false);
        when(roadMapRepo.save(sampleRoadmap)).thenReturn(sampleRoadmap);

        Roadmap result = roadMapService.createRoadMap(sampleRoadmap);

        assertEquals("RID123", result.getrId());
        verify(roadMapRepo).save(sampleRoadmap);
    }

    // Test that an exception is thrown when roadmap with rId already exists
    @Test
    void testCreateRoadMapThrowsExceptionIfExists() {
        when(roadMapRepo.existsByRId("RID123")).thenReturn(true);
        assertThrows(IllegalArgumentException.class,
                () -> roadMapService.createRoadMap(sampleRoadmap));
    }

    // Test get all roadmaps
    @Test
    void testGetAllRoadMaps() {
        List<Roadmap> roadmaps = Arrays.asList(sampleRoadmap);
        when(roadMapRepo.findAll()).thenReturn(roadmaps);

        List<Roadmap> result = roadMapService.getAllRoadMaps();

        assertEquals(1, result.size());
    }

    // Test retrieving roadmap by rId
    @Test
    void testGetRoadMapByRIdSuccess() {
        when(roadMapRepo.findByRId("RID123")).thenReturn(Optional.of(sampleRoadmap));
        Optional<Roadmap> result = roadMapService.getRoadMapByRId("RID123");

        assertTrue(result.isPresent());
        assertEquals("RID123", result.get().getrId());
    }

    // Test updating a progress item's status successfully
    @Test
    void testUpdateProgressStatusSuccess() {
        ProgressItem item = new ProgressItem("In Progress", "Started working");
        Map<String, ProgressItem> progress = new HashMap<>();
        progress.put("step1", item);
        sampleRoadmap.setProgress(progress);

        when(roadMapRepo.findByRId("RID123")).thenReturn(Optional.of(sampleRoadmap));
        when(roadMapRepo.save(any(Roadmap.class))).thenAnswer(i -> i.getArguments()[0]);

        Roadmap result = roadMapService.updateProgressStatus("RID123", "step1", "Completed", "Done");

        assertEquals("Completed", result.getProgress().get("step1").getStatus());
    }

    @Test
    void testUpdateProgressStatusThrowsIfStepMissing() {
        sampleRoadmap.setProgress(new HashMap<>());
        when(roadMapRepo.findByRId("RID123")).thenReturn(Optional.of(sampleRoadmap));

        assertThrows(IllegalArgumentException.class, () ->
                roadMapService.updateProgressStatus("RID123", "invalidStep", "Done", "Note"));
    }

    // Test deleting a roadmap successfully
    @Test
    void testDeleteRoadMapSuccess() {
        when(roadMapRepo.existsById("1")).thenReturn(true);
        roadMapService.deleteRoadMap("1");
        verify(roadMapRepo).deleteById("1");
    }

    @Test
    void testDeleteRoadMapThrowsIfNotFound() {
        when(roadMapRepo.existsById("1")).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> roadMapService.deleteRoadMap("1"));
    }
}


