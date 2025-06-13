package com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingServiceImpl;


import com.NoIdea.Lexora.dto.UserProfile.PersonaWithUserDTO;
import com.NoIdea.Lexora.model.PersonaMatchingModel.PersonaMatchingModel;
import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.PersonaMatchingRepo.PersonaMatchingRepo;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import com.NoIdea.Lexora.service.PersonaMatchingService.PersonaMatchingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonaMatchingServiceImpl implements PersonaMatchingService {

    @Autowired
    private PersonaMatchingRepo personaMatchingRepo;

    @Autowired
    private UserEntityRepository userEntityRepository;

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
    @Override
    public List<PersonaWithUserDTO> getAllPersonaWithUserDetails(Long id) {
        List<PersonaMatchingModel> personas = personaMatchingRepo.findAll();
        List<PersonaWithUserDTO> dtoList = new ArrayList<>();

        for (PersonaMatchingModel persona : personas) {
            UserEntity user = persona.getUserEntity();

            if (user != null && user.getUser_id().equals(id)) {
                PersonaWithUserDTO dto = new PersonaWithUserDTO(
                        persona.getId(),
                        persona.getNo(),
                        persona.getPersona(),
                        persona.getMatchPrecentage(),
                        persona.getSuggestion(),
                        user.getUser_id(),
                        user.getF_name(),
                        user.getL_name(),
                        user.getEmail(),
                        user.getUsername()
                );
                dtoList.add(dto); // ✅ Only add when userId matches
            }
        }

        return dtoList;
    }

//    public List<PersonaWithUserDTO> savePersonaWithUser(Long id ,List<PersonaWithUserDTO> dto) {
//        Optional<UserEntity> optionalUser = userEntityRepository.findById(id);
//        for(PersonaWithUserDTO personas :dto){
//
//
//        if (optionalUser.isPresent()) {
//            UserEntity user = optionalUser.get();
//
//            PersonaMatchingModel persona = new PersonaMatchingModel();
//            persona.setNo(personas.getNo());
//            persona.setPersona(personas.getPersona());
//            persona.setMatchPrecentage(personas.getMatchPrecentage());
//            persona.setSuggestion(personas.getSuggestion());
//            persona.setUserEntity(user);
//
//            personaMatchingRepo.save(persona);
//        } else {
//            throw new RuntimeException("User not found with ID: " + personas.getUserId());
//        }}
//    return null;}

    @Override
public List<PersonaWithUserDTO> savePersonaWithUser(Long id, List<PersonaWithUserDTO> dtoList) {
    Optional<UserEntity> optionalUser = userEntityRepository.findById(id);

    if (optionalUser.isEmpty()) {
        throw new RuntimeException("User not found with ID: " + id);
    }

    UserEntity user = optionalUser.get();
    List<PersonaWithUserDTO> savedDtoList = new ArrayList<>();

    for (PersonaWithUserDTO dto : dtoList) {
        PersonaMatchingModel persona = new PersonaMatchingModel();
        persona.setNo(dto.getNo());
        persona.setPersona(dto.getPersona());
        persona.setMatchPrecentage(dto.getMatchPrecentage());
        persona.setSuggestion(dto.getSuggestion());
        persona.setUserEntity(user);

        PersonaMatchingModel saved = personaMatchingRepo.save(persona);

        PersonaWithUserDTO savedDto = new PersonaWithUserDTO(
                saved.getId(),
                saved.getNo(),
                saved.getPersona(),
                saved.getMatchPrecentage(),
                saved.getSuggestion(),
                user.getUser_id(),
                user.getF_name(),
                user.getL_name(),
                user.getEmail(),
                user.getUsername()
        );

        savedDtoList.add(savedDto);
    }

    return savedDtoList;
}
    @Override
    public void deleteAllPersonasByUserId(Long userId) {
        Optional<UserEntity> optionalUser = userEntityRepository.findById(userId);
        if (optionalUser.isPresent()) {
            personaMatchingRepo.deleteByUserEntity(optionalUser.get());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

}
