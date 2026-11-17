package com.bloodhelp;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class JdbcService {

    private final JdbcTemplate jdbcTemplate;

    public JdbcService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Count all donors using JDBC
    public int countDonorsUsingJdbc() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM DONOR",
                Integer.class
        );

        return count == null ? 0 : count;
    }

    // Count all blood requests using JDBC
    public int countRequestsUsingJdbc() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM BLOOD_REQUEST",
                Integer.class
        );

        return count == null ? 0 : count;
    }
}