package com.aipsms.backend.repository;

import com.aipsms.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyNameContaining(String companyName);
}
