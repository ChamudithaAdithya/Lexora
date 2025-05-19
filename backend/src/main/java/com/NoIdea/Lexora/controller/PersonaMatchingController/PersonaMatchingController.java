package com.NoIdea.Lexora.controller.PersonaMatchingController;

import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import com.NoIdea.Lexora.repository.PersonaMatchingRepo.PersonaMatchingRepo;
import com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/persona")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PersonaMatchingController {

    @Autowired
    private PersonaMatchingService personaMatchingService;
    @Autowired
    private PersonaMatchingRepo personaMatchingRepo;
    @GetMapping
    public List<PersonaMatchingModel> getAllPersonaDetails(){
        return personaMatchingService.getAllPersonaDetails();
    }
    @GetMapping("/{id}")
    public Optional<PersonaMatchingModel> getPersonaDetail(@PathVariable int id){
        return personaMatchingService.getPersonaDetails(id);
    }
    @PostMapping("")
    public List<PersonaMatchingModel> receiveData(@RequestBody List<PersonaMatchingModel> tableData) {
        List<PersonaMatchingModel> savedPersonas = personaMatchingRepo.saveAll(tableData);
        return savedPersonas;  // Returns saved Persona entities
    }
    @PutMapping
    public PersonaMatchingModel updatePersona(@RequestBody PersonaMatchingModel personaMatchingModel){
        return personaMatchingService.updatePersona(personaMatchingModel);
    }
    @DeleteMapping("")
    public void deletePersona(){
        personaMatchingService.deletePersona();
    }

}

