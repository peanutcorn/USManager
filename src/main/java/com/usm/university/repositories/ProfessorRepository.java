package com.usm.university.repositories;

import com.usm.university.models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {
    Optional<Professor> findByNameAndPasswords(String name, String passwords);
}
