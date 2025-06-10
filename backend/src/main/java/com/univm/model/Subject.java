package com.univm.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @Column(name = "subject_id")
    private Integer subjectId;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "major")
    private String major;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @Column(name = "max_count")
    private Integer maxCount;

    // --- Getter methods ---
    public Integer getSubjectId() { return subjectId; }
    public String getSubjectName() { return subjectName; }
    public String getMajor() { return major; }
    public Professor getProfessor() { return professor; }
    public Integer getMaxCount() { return maxCount; }

    // --- Alias getter for department name compatibility ---
    public String getDepartmentName() { return getMajor(); }

    // --- Setter methods ---
    public void setSubjectId(Integer subjectId) { this.subjectId = subjectId; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public void setMajor(String major) { this.major = major; }
    public void setMaxCount(Integer maxCount) { this.maxCount = maxCount; }
}