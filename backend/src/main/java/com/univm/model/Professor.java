package com.univm.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "professors")
public class Professor {
    @Id
    @Column(name = "professor_id")
    private Integer professorId;

    private String name;
    private String major;
    private String passwords;
}