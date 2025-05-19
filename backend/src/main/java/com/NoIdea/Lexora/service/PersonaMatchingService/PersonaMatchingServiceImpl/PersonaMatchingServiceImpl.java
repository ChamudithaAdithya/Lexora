package com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingServiceImpl;

import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import com.NoIdea.Lexora.repository.PersonaMatchingRepo.PersonaMatchingRepo;
import com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonaMatchingServiceImpl implements PersonaMatchingService {

    @Autowired
    private PersonaMatchingRepo personaMatchingRepo;

    @Override
    public List<PersonaMatchingModel> getAllPersonaDetails(){
        return personaMatchingRepo.findAll();
    }
    @Override
    public Optional<PersonaMatchingModel> getPersonaDetails(int id){
        return personaMatchingRepo.findById(id);

    }

    public List<PersonaMatchingModel> saveAll(List<PersonaMatchingModel> tableData){
        return personaMatchingRepo.saveAll(tableData);
    }

    @Override
    public PersonaMatchingModel updatePersona(PersonaMatchingModel personaMatchingModel){
        return personaMatchingRepo.save(personaMatchingModel);
    }
    @Override
    public void deletePersona(){
        personaMatchingRepo.deleteAll();
    }

}
