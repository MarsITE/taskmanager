package com.app.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.backend.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}

