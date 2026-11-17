package com.bloodhelp;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class BloodRequestController {

    private final BloodRequestRepository bloodRequestRepository;
    private final NotificationService notificationService;

    public BloodRequestController(
            BloodRequestRepository bloodRequestRepository,
            NotificationService notificationService) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/blood-request")
    public String bloodRequestPage() {
        return "blood-request";
    }

    @GetMapping("/request")
    public String showRequestPage() {
        return "blood-request";
    }

    @PostMapping("/blood-request")
    public String submitBloodRequest(
            @RequestParam String name,
            @RequestParam String bloodGroup,
            @RequestParam String phone,
            @RequestParam String location,
            @RequestParam String units,
            @RequestParam(required = false) String message,
            Model model) {

        try {
            BloodRequest request = new BloodRequest();

            request.setPatientName(name);
            request.setBloodGroup(bloodGroup);
            request.setContactNumber(phone);
            request.setHospitalName(location);
            request.setCity(location);
            request.setUnits(Integer.parseInt(units));

            // Save request first
            BloodRequest savedRequest =
                    bloodRequestRepository.save(request);

            // Notify matching donors
            notificationService.notifyMatchingDonors(savedRequest);

            model.addAttribute("name", name);
model.addAttribute("bloodGroup", bloodGroup);
model.addAttribute("phone", phone);
model.addAttribute("location", location);
model.addAttribute("units", units);
model.addAttribute("message", message);

model.addAttribute("success",
        "Your blood request has been submitted successfully!");
                  

            return "blood-request-success";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error",
                    "Unable to submit request. Please check your details.");
            return "blood-request";
        }
    }

    @GetMapping("/requests")
    public String showSubmittedRequests(Model model) {
        model.addAttribute(
                "requests",
                bloodRequestRepository.findAll()
        );
        return "requests";
    }
    // Open Edit Blood Request page
@GetMapping("/requests/edit/{id}")
public String editBloodRequest(
        @PathVariable Long id, Model model) {

    BloodRequest bloodRequest =
            bloodRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    model.addAttribute("bloodRequest", bloodRequest);

    return "edit-request";
}

// Update Blood Request
@PostMapping("/requests/edit/{id}")
public String updateBloodRequest(
        @PathVariable Long id,
        @ModelAttribute("bloodRequest") BloodRequest updatedRequest) {

    BloodRequest existingRequest =
            bloodRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    existingRequest.setPatientName(updatedRequest.getPatientName());
    existingRequest.setBloodGroup(updatedRequest.getBloodGroup());
    existingRequest.setUnits(updatedRequest.getUnits());
    existingRequest.setHospitalName(updatedRequest.getHospitalName());
    existingRequest.setCity(updatedRequest.getCity());
    existingRequest.setContactNumber(updatedRequest.getContactNumber());

    bloodRequestRepository.save(existingRequest);

    return "redirect:/requests";
}

// Delete Blood Request
@PostMapping("/requests/delete/{id}")
public String deleteBloodRequest(@PathVariable Long id) {

    bloodRequestRepository.deleteById(id);

    return "redirect:/requests";
}
}