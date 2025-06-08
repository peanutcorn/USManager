package com.univm.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Integer enrollmentId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    // --- Getter methods ---
    public Integer getEnrollmentId() { return enrollmentId; }
    public Student getStudent() { return student; }
    public Subject getSubject() { return subject; }

    // --- Convenience methods for controller compatibility ---

    /**
     * 컨트롤러 및 리포지토리에서 Integer studentId로 접근할 수 있게 지원
     */
    public Integer getStudentId() {
        return (student != null) ? student.getStudentId() : null;
    }

    /**
     * 컨트롤러 및 리포지토리에서 Integer subjectId로 접근할 수 있게 지원
     */
    public Integer getSubjectId() {
        return (subject != null) ? subject.getSubjectId() : null;
    }

    // --- 생성자 (컨트롤러에서 바로 사용 가능하게) ---
    public Enrollment() {}

    public Enrollment(Integer enrollmentId, Integer studentId, Integer subjectId) {
        this.enrollmentId = enrollmentId;
        if(studentId != null) {
            Student s = new Student();
            s.setStudentId(studentId);
            this.student = s;
        }
        if(subjectId != null) {
            Subject sub = new Subject();
            sub.setSubjectId(subjectId);
            this.subject = sub;
        }
    }
}