 package com.bloodhelp;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserDashboardController {

    private final DonorRepository donorRepository;

    public UserDashboardController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Principal principal, Model model) {

        if (principal.getName().equals("admin")) {
            return "redirect:/admin";
        }

        List<Donor> donors =
                donorRepository.findByRegisteredBy_Username(
                        principal.getName());

        model.addAttribute("username", principal.getName());

        model.addAttribute("hasDonorRegistration",
                !donors.isEmpty());

        model.addAttribute("myDonors", donors);

        return "user-dashboard";
    }
}