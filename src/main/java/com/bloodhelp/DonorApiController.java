
package com.bloodhelp;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donors")
public class DonorApiController {

    private final DonorRepository donorRepository;
    private final AppUserRepository userRepository;

    public DonorApiController(
            DonorRepository donorRepository,
            AppUserRepository userRepository) {

        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
    }

    // Get all registered donors
    @GetMapping
    public List<DonorResponse> getAllDonors(Principal principal) {

        String username = principal != null
                ? principal.getName()
                : "";

        return donorRepository.findAll()
                .stream()
                .map(donor -> new DonorResponse(donor, username))
                .toList();
    }

    // Search donors by blood group and city
    @GetMapping("/search")
    public List<DonorResponse> searchDonors(
            @RequestParam String bloodGroup,
            @RequestParam(required = false, defaultValue = "") String city,
            Principal principal) {

        String username = principal != null
                ? principal.getName()
                : "";

        List<Donor> donors;

        if (city.isBlank()) {
            donors = donorRepository.findByBloodGroup(bloodGroup);
        } else {
            donors = donorRepository.findByBloodGroupAndCityIgnoreCase(
                    bloodGroup, city.trim());
        }

        return donors.stream()
                .map(donor -> new DonorResponse(donor, username))
                .toList();
    }

    // Register a new donor
    @PostMapping
    public ResponseEntity<?> registerDonor(
            @RequestBody Donor incomingDonor,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        if (incomingDonor.getAge() < 18 ||
                incomingDonor.getAge() > 65) {

            return ResponseEntity.badRequest()
                    .body("Age must be between 18 and 65.");
        }

        if (incomingDonor.getPhone() == null ||
                !incomingDonor.getPhone().matches("[0-9]{10}")) {

            return ResponseEntity.badRequest()
                    .body("Enter a valid 10-digit phone number.");
        }

        String username = principal.getName();

        AppUser user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User account not found.");
        }

        Donor donor = new Donor();

        donor.setName(incomingDonor.getName());
        donor.setAge(incomingDonor.getAge());
        donor.setBloodGroup(incomingDonor.getBloodGroup());
        donor.setPhone(incomingDonor.getPhone());
        donor.setCity(incomingDonor.getCity());

        donor.setRegisteredByUsername(username);
        donor.setRegisteredBy(user);
        donor.setVerified(false);
        donor.setAvailable(true);

        Donor savedDonor = donorRepository.save(donor);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DonorResponse(savedDonor, username));
    }

    // Delete a donor
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(
            @PathVariable Long id,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Donor donor = donorRepository.findById(id).orElse(null);

        if (donor == null) {
            return ResponseEntity.notFound().build();
        }

        String username = principal.getName();

        boolean ownsDonor = username.equals(
                donor.getRegisteredByUsername());

        if (!ownsDonor && donor.getRegisteredBy() != null) {
            ownsDonor = username.equals(
                    donor.getRegisteredBy().getUsername());
        }

        if (!ownsDonor) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot delete another user's donor.");
        }

        donorRepository.delete(donor);

        return ResponseEntity.noContent().build();
    }
}
