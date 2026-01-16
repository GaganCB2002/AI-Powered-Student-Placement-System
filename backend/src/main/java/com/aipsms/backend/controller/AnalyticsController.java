package com.aipsms.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @GetMapping("/placement-stats")
    public Map<String, Object> getPlacementStats() {
        // Mock data for prototype
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", 120);
        stats.put("placedStudents", 85);
        stats.put("averagePackage", "12 LPA");
        stats.put("highestPackage", "45 LPA");

        Map<String, Integer> branchWise = new HashMap<>();
        branchWise.put("CSE", 95);
        branchWise.put("ECE", 88);
        branchWise.put("MECH", 75);
        stats.put("placementRate", branchWise);

        return stats;
    }

    @GetMapping("/skill-gaps")
    public List<Map<String, Object>> getCommonSkillGaps() {
        List<Map<String, Object>> gaps = new ArrayList<>();
        gaps.add(Map.of("skill", "AWS", "deficiency", 45)); // 45% students missing AWS
        gaps.add(Map.of("skill", "Docker", "deficiency", 30));
        gaps.add(Map.of("skill", "React", "deficiency", 20));
        return gaps;
    }
}
