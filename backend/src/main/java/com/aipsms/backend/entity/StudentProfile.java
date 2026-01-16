package com.aipsms.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "student_profiles")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String skills; // JSON string or comma-separated

    private Double cgpa;
    private String department;
    private Integer graduationYear;

    @Enumerated(EnumType.STRING)
    private PlacementStatus placementStatus;

    public enum PlacementStatus {
        NOT_PLACED, PLACED
    }
}
