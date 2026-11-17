package com.bloodhelp;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.security.crypto.password.PasswordEncoder;

@Controller
public class UserController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/signup")
    public String showSignupPage(Model model) {
        model.addAttribute("user", new AppUser());
        return "signup";
    }

    @PostMapping("/signup")
    public String registerUser(
            @ModelAttribute("user") AppUser user,
            Model model) {

        String username = user.getUsername();
        String password = user.getPassword();

        if (username == null || username.trim().isEmpty()
                || password == null || password.length() < 8) {
            model.addAttribute("error",
                    "Enter a username and password of at least 8 characters.");
            return "signup";
        }

        username = username.trim();

        if (userRepository.existsByUsername(username)) {
            model.addAttribute("error",
                    "This username is already registered.");
            return "signup";
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole("USER");

        userRepository.save(newUser);

        return "redirect:/signup?success";
    }
}