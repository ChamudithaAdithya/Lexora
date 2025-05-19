package com.NoIdea.Lexora.repository.PersonaMatchingRepo;

import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaMatchingRepo extends JpaRepository<PersonaMatchingModel, Integer> {

}
