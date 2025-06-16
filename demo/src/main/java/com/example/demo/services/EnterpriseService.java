package com.example.demo.services;

import com.example.demo.dto.EnterpriseRequest;
import com.example.demo.dto.EnterpriseResponse;
import com.example.demo.exceptions.EmailAlreadyExistsException;
import com.example.demo.exceptions.EnterpriseAlreadyExistsException;
import com.example.demo.exceptions.InvalidInputException;
import com.example.demo.models.Enterprise;
import com.example.demo.models.User;
import com.example.demo.repositories.EnterpriseRepository;
import com.example.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EnterpriseService {
    private final UserRepository userRepo;
    private final EnterpriseRepository enterpriseRepository;

    public EnterpriseResponse createEnterprise(EnterpriseRequest request)
    {
        if(!StringUtils.hasText(request.name()))
        {
           throw new InvalidInputException("Enterprise name is NULL");
        }
        Optional<Enterprise> existing = enterpriseRepository.findByName(request.name());
        if(existing.isPresent())
        {
            throw new EnterpriseAlreadyExistsException("Enterprise already exists, please choose from the list");
        }

        Enterprise enterprise = new Enterprise();
        enterprise.setName(request.name());

        Enterprise saved = enterpriseRepository.save(enterprise);

        EnterpriseResponse enterpriseResponse = new EnterpriseResponse(saved.getId(), saved.getName());

        return enterpriseResponse;
    }

    public List<EnterpriseResponse> getAllEnterprises()
    {
        List<Enterprise> enterprises = enterpriseRepository.findAll();

        List<EnterpriseResponse> responses = enterprises.stream().map((m) -> {
            EnterpriseResponse response = new EnterpriseResponse(m.getId(), m.getName());
            return response;
        }).toList();

       return responses;
    }
}
