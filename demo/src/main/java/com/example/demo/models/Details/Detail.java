package com.example.demo.models.Details;

import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "details")
public class Detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String number;

    @Column(nullable = false)
    private String name;

    @Column(name = "order_number")
    private String orderNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String shape;

    private String type;
}
