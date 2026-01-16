package com.aipsms.backend.controller;

import com.aipsms.backend.entity.Job;
import com.aipsms.backend.entity.User;
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
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('COMPANY_HR') or hasAuthority('PLACEMENT_OFFICER')")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        // Get current user
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        job.setPostedBy(currentUser);
        jobRepository.save(job);
        return ResponseEntity.ok(job);
    }
}
