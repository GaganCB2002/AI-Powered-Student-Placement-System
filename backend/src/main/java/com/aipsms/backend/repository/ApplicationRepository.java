package com.aipsms.backend.repository;

import com.aipsms.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);

    List<Application> findByJobId(Long jobId);
}
