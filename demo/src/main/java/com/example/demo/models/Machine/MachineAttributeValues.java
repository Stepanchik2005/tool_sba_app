package com.example.demo.models.Machine;
import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "machine_attribute_values")
public class MachineAttributeValues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private MachineAttributes attribute;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String value;
}
