package com.univm.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @Column(name = "admin_id")
    private String adminId;

    private String name;
    private String passwords;
}