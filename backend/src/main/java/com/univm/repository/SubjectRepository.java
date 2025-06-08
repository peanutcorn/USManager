package com.univm.repository;

import com.univm.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Optional<Subject> findBySubjectId(Integer subjectId);
    List<Subject> findBySubjectNameContaining(String subjectName);
    List<Subject> findByMajorContaining(String major);  // 변경: departmentName → major
}