package com.bar_raw_materials.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar_raw_materials.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
