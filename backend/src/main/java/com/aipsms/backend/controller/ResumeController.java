package com.aipsms.backend.controller;

import com.aipsms.backend.service.AiClientService;
import com.aipsms.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AiClientService aiClientService;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('STUDENT')") // Ensure only students can upload
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        String message = "";
        try {
            String filePath = fileStorageService.save(file);

            // Trigger AI Analysis
            String analysisResult = aiClientService.analyzeResume(filePath);

            return ResponseEntity.ok().body("Resume uploaded and analyzed: " + analysisResult);
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + ". Error: " + e.getMessage();
            return ResponseEntity.status(500).body(message);
        }
    }
}
