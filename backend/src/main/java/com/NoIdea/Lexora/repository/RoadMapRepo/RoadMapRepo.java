package com.NoIdea.Lexora.repository.RoadMapRepo;

import com.NoIdea.Lexora.model.RoadMapModel.Roadmap;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadMapRepo extends MongoRepository<Roadmap, String> {

    Optional<Roadmap> findByRId(String rId);

    List<Roadmap> findByUserId(Integer userId);

    List<Roadmap> findByJobName(String jobName);

    List<Roadmap> findByUserIdAndJobName(Integer userId, String jobName);

    boolean existsByRId(String rId);

    void deleteByRId(String rId);
}
