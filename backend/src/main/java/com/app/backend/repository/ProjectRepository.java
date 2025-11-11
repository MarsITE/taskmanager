package com.app.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.app.backend.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> { }

