package com.example.demo.models.Set;

import com.example.demo.models.Material;
import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "instrument")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instrument extends SetObject{

    private String instrumentMaterial;

    @ManyToMany
    @JoinTable(
            name = "instrument_material",
            joinColumns = @JoinColumn(name = "instrument_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private List<Material> materials;

}
