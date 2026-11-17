package com.bloodhelp;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final JdbcService jdbcService;

    public HomeController(JdbcService jdbcService) {
        this.jdbcService = jdbcService;
    }

    // Open the main website
    @GetMapping("/")
    public String home() {
        return "index";
    }

    // Open the admin dashboard
    @GetMapping("/admin")
    public String adminDashboard(Model model) {

        int totalDonors = jdbcService.countDonorsUsingJdbc();
        int totalRequests = jdbcService.countRequestsUsingJdbc();

        model.addAttribute("totalDonors", totalDonors);
        model.addAttribute("totalRequests", totalRequests);

        return "admin";
    }
}