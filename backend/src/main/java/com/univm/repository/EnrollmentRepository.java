package com.univm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.univm.model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    // 과목명 LIKE 조회
    @Query("SELECT e FROM Enrollment e WHERE e.subject.subjectName LIKE %:subjectName%")
    List<Enrollment> findBySubjectNameContaining(@Param("subjectName") String subjectName);

    // 학생명 LIKE 조회
    @Query("SELECT e FROM Enrollment e WHERE e.student.name LIKE %:studentName%")
    List<Enrollment> findByStudentNameContaining(@Param("studentName") String studentName);

    List<Enrollment> findByStudent_StudentId(Integer studentId);
    long countBySubject_SubjectId(Integer subjectId);
    boolean existsByStudent_StudentIdAndSubject_SubjectId(Integer studentId, Integer subjectId);
}