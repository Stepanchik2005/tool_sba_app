package com.example.demo.models;


import com.example.demo.models.Details.Detail;
import com.example.demo.models.Machine.Machine;
import com.example.demo.models.Process.ProcessingMethod;
import com.example.demo.models.Process.ProcessingType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technological_situation")
@Data
public class TechnologicalSituation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Деталь
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id", nullable = false)
    private Detail detail;

    // 🔗 Станок
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

    // 🔗 Тип охолодження (опційно)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooling_type_id")
    private CoolingType coolingType;

    // 🔗 Вид охолодження (опційно)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooling_method_id")
    private CoolingMethod coolingMethod;

    // 🔗 Користувач, який створив рішення
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
