package com.example.demo.dto.set;

import java.time.LocalDateTime;

public record SetRatingResponse(
        Long id,
        Long setId,
        Integer rating,
        String username,
        LocalDateTime createdAt
) {}

