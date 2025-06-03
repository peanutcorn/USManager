package com.univm.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @Column(name = "student_id")
    private Integer studentId;

    private String name;
    private String major;
    private String passwords;
    private Float score;
}