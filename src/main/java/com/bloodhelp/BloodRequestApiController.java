
package com.bloodhelp;

import java.util.Map;
import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestApiController {

    private final BloodRequestRepository bloodRequestRepository;
    private final NotificationService notificationService;
    private final AppUserRepository appUserRepository;

    public BloodRequestApiController(
            BloodRequestRepository bloodRequestRepository,
            NotificationService notificationService,
            AppUserRepository appUserRepository) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.notificationService = notificationService;
        this.appUserRepository = appUserRepository;
    }

    @GetMapping
    public java.util.List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody BloodRequestData data,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        AppUser user = appUserRepository
                .findByUsername(principal.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User account not found.");
        }

        if (data.name() == null || data.name().isBlank()
                || data.bloodGroup() == null || data.bloodGroup().isBlank()
                || data.phone() == null || !data.phone().matches("[0-9]{10}")
                || data.location() == null || data.location().isBlank()
                || data.units() < 1) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please enter valid request details."));
        }

        BloodRequest request = new BloodRequest();

        request.setPatientName(data.name());
        request.setBloodGroup(data.bloodGroup());
        request.setContactNumber(data.phone());
        request.setHospitalName(data.location());
        request.setCity(data.location());
        request.setUnits(data.units());

        // Connect request to the logged-in user
        request.setRegisteredByUsername(user.getUsername());
        request.setRegisteredBy(user);

        BloodRequest savedRequest =
                bloodRequestRepository.save(request);

        notificationService.notifyMatchingDonors(savedRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Blood request submitted successfully!",
                        "id", savedRequest.getId()
                ));
    }

    public record BloodRequestData(
            String name,
            String bloodGroup,
            String phone,
            String location,
            int units,
            String message
    ) {}
}
