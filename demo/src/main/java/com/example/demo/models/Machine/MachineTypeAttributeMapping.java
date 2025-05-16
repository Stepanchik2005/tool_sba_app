package com.example.demo.models.Machine;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
@Table(name = "machine_type_attribute_mapping")
@IdClass(MachineTypeAttributeMapping.MachineTypeAttributeId.class)
public class MachineTypeAttributeMapping {
    @Id
    private String type;

    @Id
    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private MachineAttributes attribute;

    public static class MachineTypeAttributeId implements Serializable {
        private String type;
        private MachineAttributes attribute;

        public MachineTypeAttributeId() {}

        public MachineTypeAttributeId(String type, MachineAttributes attribute)
        {
            this.type = type;
            this.attribute = attribute;
        }

        @Override
        public boolean equals(Object o)
        {
            if(this == o) return true;
            if( !(o instanceof MachineTypeAttributeId)) return false;

            MachineTypeAttributeId that = (MachineTypeAttributeId) o;

            return Objects.equals(that.type, this.type) && Objects.equals(that.attribute, this.attribute);
        }
        @Override
        public int hashCode()
        {
            return Objects.hash(type, attribute);
        }
    }
}
