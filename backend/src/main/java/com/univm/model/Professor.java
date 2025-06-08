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

    @Column(name = "name")
    private String name;

    @Column(name = "major")
    private String major;

    @Column(name = "passwords")
    private String passwords;

    // --- Getter methods ---
    public Integer getProfessorId() { return professorId; }
    public String getName() { return name; }
    public String getMajor() { return major; }
    public String getPasswords() { return passwords; }

    // --- Setter methods ---
    public void setProfessorId(Integer professorId) { this.professorId = professorId; }
    public void setName(String name) { this.name = name; }
    public void setMajor(String major) { this.major = major; }
    public void setPasswords(String passwords) { this.passwords = passwords; }

    // --- Controller compatibility ---

    // 컨트롤러에서 getProfessorName() 형태로 호출할 때 대응
    public String getProfessorName() { return getName(); }
}