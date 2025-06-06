package com.example.demo.controllers.Set;

import com.example.demo.dto.set.SetRatingRequest;
import com.example.demo.dto.set.SetRatingResponse;
import com.example.demo.models.Set.SetEntity;
import com.example.demo.models.Set.SetRating;
import com.example.demo.models.User;
import com.example.demo.repositories.Set.InstrumentRepository;
import com.example.demo.repositories.Set.SetRatingRepository;
import com.example.demo.repositories.Set.SetRepository;
import com.example.demo.repositories.Set.ToolHolderRepository;
import com.example.demo.repositories.ToolAdapterRepository;
import com.example.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class SetRatingController {
    private final ToolHolderRepository toolHolderRepository;
    private final InstrumentRepository instrumentRepository;
    private final ToolAdapterRepository toolAdapterRepository;
    private final SetRepository setRepository;
    private final UserRepository userRepository;
    private final SetRatingRepository ratingRepository;

    @PostMapping("/set/{id}/rate")
    public ResponseEntity<?> create(@PathVariable Long id, @RequestBody SetRatingRequest request, Authentication auth)
    {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));

        SetEntity set = setRepository.findById(request.setId()).orElseThrow(() -> new RuntimeException("Set not found"));

        SetRating rating = new SetRating();
        rating.setSet(set);
        rating.setUser(user);
        rating.setRating(request.rating());

        ratingRepository.save(rating);

        SetRatingResponse response = new SetRatingResponse(
                rating.getId(),
                set.getId(),
                rating.getRating(),
                user.getUsername(),
                rating.getCreatedAt()
        );

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", HttpStatus.OK.value(),
                "message", "Successfully created rating",
                "data", response
        ));
    }
}
