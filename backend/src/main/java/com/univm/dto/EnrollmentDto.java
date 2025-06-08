package com.univm.dto;

import com.univm.model.Enrollment;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EnrollmentDto {
    private Integer enrollment_id;
    private Integer student_id;
    private String student_name;
    private Integer student_year;
    private Integer subject_id;
    private String subject_name;

    // Getter & Setter
    public Integer getEnrollment_id() { return enrollment_id; }
    public void setEnrollment_id(Integer enrollment_id) { this.enrollment_id = enrollment_id; }
    public Integer getStudent_id() { return student_id; }
    public void setStudent_id(Integer student_id) { this.student_id = student_id; }
    public String getStudent_name() { return student_name; }
    public void setStudent_name(String student_name) { this.student_name = student_name; }
    public Integer getStudent_year() { return student_year; }
    public void setStudent_year(Integer student_year) { this.student_year = student_year; }
    public Integer getSubject_id() { return subject_id; }
    public void setSubject_id(Integer subject_id) { this.subject_id = subject_id; }
    public String getSubject_name() { return subject_name; }
    public void setSubject_name(String subject_name) { this.subject_name = subject_name; }

    // fromEntity 메서드
    public static EnrollmentDto fromEntity(com.univm.model.Enrollment e) {
        EnrollmentDto dto = new EnrollmentDto();
        dto.setEnrollment_id(e.getEnrollmentId());
        dto.setStudent_id(e.getStudent().getStudentId());
        dto.setStudent_name(e.getStudent().getStudentName());
        dto.setSubject_id(e.getSubject().getSubjectId());
        dto.setSubject_name(e.getSubject().getSubjectName());
        return dto;
    }
}