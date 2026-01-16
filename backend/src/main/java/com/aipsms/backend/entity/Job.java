package com.aipsms.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills; // JSON or comma separated

    private String salaryRange;
    private String location;

    @ManyToOne
    @JoinColumn(name = "posted_by", referencedColumnName = "id")
    private User postedBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}
