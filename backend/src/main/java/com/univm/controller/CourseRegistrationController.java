package com.univm.controller;

import com.univm.model.Enrollment;
import com.univm.model.Subject;
import com.univm.model.Professor;
import com.univm.repository.EnrollmentRepository;
import com.univm.repository.SubjectRepository;
import com.univm.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class CourseRegistrationController {

    @Autowired
    private SubjectRepository subjectRepo;

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Autowired
    private ProfessorRepository professorRepo;

    @GetMapping("/{studentId}/course-registration-list")
    public ResponseEntity<?> getCourseRegistrationList(
            @PathVariable("studentId") Integer studentId,
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String filterValue
    ) {
        if (studentId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "studentId가 올바르지 않습니다.");
            return ResponseEntity.badRequest().body(error);
        }

        List<Subject> subjectList = subjectRepo.findAll();

        // 필터링
        if (filterType != null && filterValue != null && !filterValue.isEmpty()) {
            if (filterType.equalsIgnoreCase("major")) {
                subjectList = subjectRepo.findByMajorContaining(filterValue);
            } else if (filterType.equalsIgnoreCase("subject")) {
                subjectList = subjectRepo.findBySubjectNameContaining(filterValue);
            }
        }

        List<Enrollment> enrollments = enrollmentRepo.findByStudent_StudentId(studentId);

        Map<Integer, Long> subjectIdToCount = enrollmentRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getSubjectId(), Collectors.counting()
                ));

        List<Map<String, Object>> subjectInfoList = new ArrayList<>();
        for (Subject s : subjectList) {
            Map<String, Object> m = new HashMap<>();
            m.put("subject_id", s.getSubjectId());
            m.put("subject_name", s.getSubjectName());
            Professor p = (s.getProfessor().getProfessorId() != null) ? professorRepo.findByProfessorId(s.getProfessor().getProfessorId()).orElse(null) : null;
            m.put("professor_name", p != null ? p.getProfessorName() : "");
            m.put("department_name", s.getMajor() != null ? s.getMajor() : "");
            m.put("current_count", subjectIdToCount.getOrDefault(s.getSubjectId(), 0L));
            m.put("max_count", s.getMaxCount());
            subjectInfoList.add(m);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("subjects", subjectInfoList);
        result.put("enrollments", enrollments);
        return ResponseEntity.ok(result);
    }
}