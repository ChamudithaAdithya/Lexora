package com.NoIdea.Lexora.service.PersonaMatchingService;


import com.NoIdea.Lexora.dto.UserProfile.PersonaWithUserDTO;
import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;

import java.util.List;
import java.util.Optional;

public interface PersonaMatchingService {




    List<PersonaMatchingModel> saveAll(List<PersonaMatchingModel> personas);


    public List<PersonaMatchingModel> getAllPersonaDetails();
    public Optional<PersonaMatchingModel> getPersonaDetails(int id);
    public PersonaMatchingModel updatePersona(PersonaMatchingModel personaMatchingModel);
    public void deletePersona();
    public List<PersonaWithUserDTO> getAllPersonaWithUserDetails(Long id);
    public List<PersonaWithUserDTO> savePersonaWithUser(Long id, List<PersonaWithUserDTO> dtoList);
    public void deleteAllPersonasByUserId(Long userId);
}
