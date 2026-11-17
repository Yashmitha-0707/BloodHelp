package com.bloodhelp;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class DonorController {

    private final DonorRepository donorRepository;
    private final AppUserRepository userRepository;

    public DonorController(
            DonorRepository donorRepository,
            AppUserRepository userRepository) {

        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("donor", new Donor());
        return "register";
    }

    @PostMapping("/register")
    public String registerDonor(
            @ModelAttribute("donor") Donor donor,
            Model model,
            Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        if (donor.getAge() < 18 || donor.getAge() > 65) {
            model.addAttribute("error",
                    "Age must be between 18 and 65.");
            return "register";
        }

        if (donor.getPhone() == null ||
                !donor.getPhone().matches("[0-9]{10}")) {
            model.addAttribute("error",
                    "Enter a valid 10-digit phone number.");
            return "register";
        }

        String username = principal.getName();

        donor.setRegisteredByUsername(username);

        AppUser user = userRepository
                .findByUsername(username)
                .orElse(null);

        donor.setRegisteredBy(user);

        donor.setVerified(false);
        donor.setAvailable(true);

        donorRepository.save(donor);

        return "redirect:/register?success";
    }

    @GetMapping("/search")
public String searchDonors() {
    return "search";
}
@GetMapping("/search/results")
public String searchResults(
        @RequestParam String bloodGroup,
        @RequestParam String city,
        Model model) {

    List<Donor> donors =
            donorRepository.findByBloodGroupAndCityIgnoreCase(bloodGroup, city);

    model.addAttribute("donors", donors);
    model.addAttribute("bloodGroup", bloodGroup);
    model.addAttribute("city", city);

    return "search-results";
}
@GetMapping("/donors")
public String showDonors(Model model, Principal principal) {

    List<Donor> donors = donorRepository.findAll();
    model.addAttribute("donors", donors);

    if (principal != null) {
        model.addAttribute("username", principal.getName());
    }

    return "donors";
}
    private boolean ownsDonor(Donor donor, String username) {
        if (donor == null || username == null) {
            return false;
        }

        if (username.equals(donor.getRegisteredByUsername())) {
            return true;
        }

        return donor.getRegisteredBy() != null &&
                username.equals(
                        donor.getRegisteredBy().getUsername());
    }

    @GetMapping("/donors/edit/{id}")
    public String editDonorPage(
            @PathVariable Long id,
            Principal principal,
            Model model) {

        Donor donor = donorRepository.findById(id).orElse(null);

        if (principal == null ||
                !ownsDonor(donor, principal.getName())) {
            return "redirect:/dashboard";
        }

        model.addAttribute("donor", donor);
        return "edit-donor";
    }

    @PostMapping("/donors/edit/{id}")
    public String updateDonor(
            @PathVariable Long id,
            @ModelAttribute("donor") Donor updatedDonor,
            Principal principal,
            Model model) {

        Donor existingDonor =
                donorRepository.findById(id).orElse(null);

        if (principal == null ||
                !ownsDonor(existingDonor, principal.getName())) {
            return "redirect:/dashboard";
        }

        if (updatedDonor.getAge() < 18 ||
                updatedDonor.getAge() > 65) {
            model.addAttribute("error",
                    "Age must be between 18 and 65.");
            model.addAttribute("donor", existingDonor);
            return "edit-donor";
        }

        if (updatedDonor.getPhone() == null ||
                !updatedDonor.getPhone().matches("[0-9]{10}")) {
            model.addAttribute("error",
                    "Enter a valid 10-digit phone number.");
            model.addAttribute("donor", existingDonor);
            return "edit-donor";
        }

        existingDonor.setName(updatedDonor.getName());
        existingDonor.setAge(updatedDonor.getAge());
        existingDonor.setBloodGroup(updatedDonor.getBloodGroup());
        existingDonor.setPhone(updatedDonor.getPhone());
        existingDonor.setCity(updatedDonor.getCity());

        donorRepository.save(existingDonor);

        return "redirect:/dashboard?updated";
    }
    @PostMapping("/donors/delete/{id}")
public String deleteDonor(
        @PathVariable Long id,
        Principal principal) {

    Donor donor = donorRepository.findById(id).orElse(null);

    if (principal == null ||
            !ownsDonor(donor, principal.getName())) {
        return "redirect:/dashboard";
    }

    donorRepository.delete(donor);

    return "redirect:/donors";
}
}