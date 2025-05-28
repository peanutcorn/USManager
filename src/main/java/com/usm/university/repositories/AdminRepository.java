package com.usm.university.repositories;

import com.usm.university.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByNameAndPasswords(String name, String passwords);
}
