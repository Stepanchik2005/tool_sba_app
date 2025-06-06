package com.example.demo.models.Set;

import com.example.demo.models.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name="supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private  String email;

    @NotNull
    private String name;

    private String mobile;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
