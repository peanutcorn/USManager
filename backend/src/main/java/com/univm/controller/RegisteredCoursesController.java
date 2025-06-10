package com.univm.controller;

import com.univm.service.RegisteredCoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("api/student")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        allowCredentials = "true",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class RegisteredCoursesController {

    // 수강신청 서비스 클래스 주입
    @Autowired
    private RegisteredCoursesService registeredCoursesService;

    // 학생의 수강신청 목록을 조회하는 메서드
    @GetMapping("/{studentId}/registered-courses")
    public ResponseEntity<?> getConfirmedCourses(@PathVariable String studentId) {
        try {
            List<Map<String, Object>> courses = registeredCoursesService.Confirmed_Subject_view(studentId); // 수강신청 목록 조회
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of( // 수강신청 목록 조회 중 에러 발생 시 응답
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    // 학생이 수강신청을 취소하는 메서드
    @DeleteMapping("/{studentId}/registered-courses/delete")
    public ResponseEntity<?> dropCourse(
            @PathVariable String studentId,
            @PathVariable String subjectId) {
        try { // 수강신청 취소 요청 처리
            registeredCoursesService.drop_sub(studentId, subjectId);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Course successfully dropped"
            ));
        } catch (Exception e) { // 수강신청 취소 중 에러 발생 시 응답
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}