package com.usm.university.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId; // This is admin_id in fact
    private String name;
    private String passwords;
}
