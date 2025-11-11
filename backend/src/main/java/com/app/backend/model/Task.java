package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    private Project project;

    @ManyToOne
    private User assignedUser;

    public enum Status {
        TODO,
        IN_PROGRESS,
        DONE
    }
}

