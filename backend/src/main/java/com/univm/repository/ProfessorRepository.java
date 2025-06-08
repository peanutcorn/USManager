package com.univm.repository;

import com.univm.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {
    Optional<Professor> findByProfessorId(Integer professorId); // 기본키 조회
    List<Professor> findByNameContaining(String name); // 이름 검색
    List<Professor> findByMajorContaining(String major); // 전공(학과) 검색
}