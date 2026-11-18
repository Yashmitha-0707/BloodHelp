
package com.bloodhelp;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestEditApiController {

    private final BloodRequestRepository bloodRequestRepository;

    public BloodRequestEditApiController(
            BloodRequestRepository bloodRequestRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
    }

    // Check ownership
    private boolean isOwner(BloodRequest request, Principal principal) {
        return principal != null
                && request.getRegisteredByUsername() != null
                && request.getRegisteredByUsername()
                        .equals(principal.getName());
    }

    // Get one request for editing
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(
            @PathVariable Long id,
            Principal principal) {

        BloodRequest request = bloodRequestRepository.findById(id)
                .orElse(null);

        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isOwner(request, principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot edit someone else's request.");
        }

        return ResponseEntity.ok(request);
    }

    // Update request
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(
            @PathVariable Long id,
            @RequestBody BloodRequestUpdateData data,
            Principal principal) {

        BloodRequest request = bloodRequestRepository.findById(id)
                .orElse(null);

        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isOwner(request, principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot edit someone else's request.");
        }

        if (data.patientName() == null || data.patientName().isBlank()
                || data.bloodGroup() == null || data.bloodGroup().isBlank()
                || data.units() < 1
                || data.hospitalName() == null || data.hospitalName().isBlank()
                || data.city() == null || data.city().isBlank()
                || data.contactNumber() == null
                || !data.contactNumber().matches("[0-9]{10}")) {

            return ResponseEntity.badRequest()
                    .body("Please enter valid request details.");
        }

        request.setPatientName(data.patientName());
        request.setBloodGroup(data.bloodGroup());
        request.setUnits(data.units());
        request.setHospitalName(data.hospitalName());
        request.setCity(data.city());
        request.setContactNumber(data.contactNumber());

        BloodRequest updated = bloodRequestRepository.save(request);

        return ResponseEntity.ok(updated);
    }

    // Delete request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(
            @PathVariable Long id,
            Principal principal) {

        BloodRequest request = bloodRequestRepository.findById(id)
                .orElse(null);

        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isOwner(request, principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot delete someone else's request.");
        }

        bloodRequestRepository.delete(request);

        return ResponseEntity.ok("Blood request deleted successfully.");
    }

    public record BloodRequestUpdateData(
            String patientName,
            String bloodGroup,
            int units,
            String hospitalName,
            String city,
            String contactNumber
    ) {}
}
