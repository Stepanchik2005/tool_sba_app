package com.example.demo.models.Details;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
@Table(name= "shape_attribute_mapping")
@IdClass(ShapeAttributeMapping.ShapeAttributeId.class)
public class ShapeAttributeMapping {
    @Id
    private String shape;

    @Id
    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    private DetailAttributes attribute;

    public static class ShapeAttributeId implements Serializable
    {
        private String shape;
        private DetailAttributes attribute;
        public ShapeAttributeId(){};

        public ShapeAttributeId(String shape, DetailAttributes attribute)
        {
            this.shape = shape;
            this.attribute = attribute;
        }

        @Override
        public boolean equals(Object o)
        {
            if(this == o) return false;
            if(!(o instanceof ShapeAttributeMapping.ShapeAttributeId)) return false;

            ShapeAttributeId that = (ShapeAttributeId) o;
            return Objects.equals(this.shape, that.shape) && Objects.equals(this.attribute, that.attribute);
        }
        @Override
        public int hashCode()
        {
            return Objects.hash(shape, attribute);
        }
    }
}
