
package com.bloodhelp;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/signup")
public class SignupApiController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SignupApiController(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestBody SignupRequest request) {

        if (request.username() == null
                || request.password() == null) {

            return ResponseEntity.badRequest().body(
                    Map.of("error", "Username and password are required.")
            );
        }

        String username = request.username().trim();
        String password = request.password();

        if (username.length() < 3 || username.length() > 30
                || password.length() < 8) {

            return ResponseEntity.badRequest().body(
                    Map.of("error",
                            "Username must be 3-30 characters and password at least 8 characters.")
            );
        }

        if (userRepository.existsByUsername(username)) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("error", "This username is already registered.")
            );
        }

        AppUser newUser = new AppUser();

        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole("USER");

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Account created successfully!")
        );
    }

    public record SignupRequest(
            String username,
            String password
    ) {}
}
