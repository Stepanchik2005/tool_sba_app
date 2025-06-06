package com.example.demo.models.Set;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tool_holder")
@Data

@AllArgsConstructor
@Builder
public class ToolHolder extends SetObject{

}
