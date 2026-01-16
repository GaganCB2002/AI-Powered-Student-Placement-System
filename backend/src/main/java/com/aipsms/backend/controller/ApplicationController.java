package com.aipsms.backend.controller;

import com.aipsms.backend.entity.Application;
import com.aipsms.backend.entity.Job;
import com.aipsms.backend.entity.User;
import com.aipsms.backend.repository.ApplicationRepository;
import com.aipsms.backend.repository.JobRepository;
import com.aipsms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User student = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        // (Simplified logic, ideal to check repository)

        Application application = new Application();
        application.setJob(job);
        application.setStudent(student);
        application.setStatus(Application.ApplicationStatus.APPLIED);

        applicationRepository.save(application);

        return ResponseEntity.ok("Applied successfully!");
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAuthority('STUDENT')")
    public List<Application> getMyApplications() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User student = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return applicationRepository.findByStudentId(student.getId());
    }
}
