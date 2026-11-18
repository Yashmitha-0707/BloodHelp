
package com.bloodhelp;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardApiController {

    private final DonorRepository donorRepository;

    public DashboardApiController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @GetMapping("/api/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please login first."));
        }

        String username = principal.getName();

        List<DonorResponse> myDonors = donorRepository
                .findByRegisteredBy_Username(username)
                .stream()
                .map(donor -> new DonorResponse(donor, username))
                .toList();

        return ResponseEntity.ok(
                Map.of(
                        "username", username,
                        "myDonors", myDonors
                )
        );
    }
}
