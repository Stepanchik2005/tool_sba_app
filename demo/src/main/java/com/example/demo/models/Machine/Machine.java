package com.example.demo.models.Machine;

import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "machines")
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventory_number")
    private String inventoryNumber;

    @Column(name = "workshop_number")
    private String workshopNumber;

    @Column(name = "type_m")
    private String type;

    @Column(nullable = false)
    private String model;

    @Column(name = "chpk_system")
    private String chpkSystem;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
