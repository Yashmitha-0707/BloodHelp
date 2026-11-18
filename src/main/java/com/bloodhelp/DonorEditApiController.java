
package com.bloodhelp;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donors")
public class DonorEditApiController {

    private final DonorRepository donorRepository;

    public DonorEditApiController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    private boolean isOwner(Donor donor, String username) {
        if (donor.getRegisteredByUsername() != null
                && donor.getRegisteredByUsername().equals(username)) {
            return true;
        }

        return donor.getRegisteredBy() != null
                && username.equals(donor.getRegisteredBy().getUsername());
    }

    // GET donor details for editing
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonor(
            @PathVariable Long id,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please login first."));
        }

        Optional<Donor> result = donorRepository.findById(id);

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Donor not found."));
        }

        Donor donor = result.get();

        if (!isOwner(donor, principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You cannot edit this donor."));
        }

        return ResponseEntity.ok(
                new DonorResponse(donor, principal.getName())
        );
    }

    // UPDATE donor details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonor(
            @PathVariable Long id,
            @RequestBody DonorUpdateRequest request,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please login first."));
        }

        Optional<Donor> result = donorRepository.findById(id);

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Donor not found."));
        }

        Donor donor = result.get();

        if (!isOwner(donor, principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You cannot edit this donor."));
        }

        if (request.name() == null || request.name().trim().isEmpty()
                || request.age() < 18 || request.age() > 65
                || request.bloodGroup() == null
                || request.phone() == null
                || !request.phone().matches("[0-9]{10}")
                || request.city() == null
                || request.city().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please enter valid donor details."));
        }

        donor.setName(request.name().trim());
        donor.setAge(request.age());
        donor.setBloodGroup(request.bloodGroup());
        donor.setPhone(request.phone());
        donor.setCity(request.city().trim());

        Donor savedDonor = donorRepository.save(donor);

        return ResponseEntity.ok(
                new DonorResponse(savedDonor, principal.getName())
        );
    }

    public record DonorUpdateRequest(
            String name,
            int age,
            String bloodGroup,
            String phone,
            String city
    ) {}
}
