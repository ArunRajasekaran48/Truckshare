package com.truckshare.user_service.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserSchemaMigrationConfig implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        // Ensure backward-compatible rollout when existing DBs don't have this column yet.
        jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS driver_availability VARCHAR(32)");
        jdbcTemplate.execute("UPDATE users SET driver_availability = 'AVAILABLE' WHERE driver_availability IS NULL");
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN driver_availability SET NOT NULL");
        log.info("User schema migration ensured column: users.driver_availability");
    }
}
