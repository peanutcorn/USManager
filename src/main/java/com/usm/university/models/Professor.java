package com.usm.university.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer professorId;
    private String name;
    private String major;
    private String passwords;
}