package com.example.demo.models.Details;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
@Table(name="shape_type_mapping")
@IdClass(ShapeTypeMapping.ShapeTypeId.class)
public class ShapeTypeMapping {
    @Id
    private String shape;

    @Id
    private String type;

    public static class ShapeTypeId implements Serializable{
        private String shape;
        private String type;

        public ShapeTypeId(){};

        public ShapeTypeId(String shape, String type)
        {
            this.shape = shape;
            this.type = type;
        }

        @Override
        public boolean equals(Object o)
        {
            if(this == o) return true;
            if(!(o instanceof ShapeTypeId)) return false;

            ShapeTypeId that = (ShapeTypeId) o;

            return Objects.equals(shape, that.shape) && Objects.equals(type, that.type);
        }

        @Override
        public int hashCode()
        {
            return Objects.hash(shape, type);
        }
    }
}
