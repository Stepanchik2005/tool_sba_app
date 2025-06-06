package com.example.demo.models;

import com.example.demo.models.Details.Detail;
import com.example.demo.models.Machine.Machine;
import com.example.demo.models.Process.ProcessingMethod;
import com.example.demo.models.Process.ProcessingType;
import com.example.demo.models.Set.SetEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "technological_solution")
@Data
@ToString(exclude = "set")
public class TechnologicalSolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id", nullable = false)
    private Detail detail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    // 🔗 Метод обробки
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processing_method_id", nullable = false)
    private ProcessingMethod processingMethod;

    // 🔗 Тип обробки (leaf вузол дерева)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processing_type_id", nullable = false)
    private ProcessingType processingType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "set_id", nullable = false)
    private SetEntity set;
}
