package com.bloodhelp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("BloodHelp@123"))
                .roles("ADMIN")
                .build();

        return username -> {

            if (username.equals("admin")) {
                return admin;
            }

            AppUser appUser = userRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new UsernameNotFoundException("User not found"));

            return User.builder()
                    .username(appUser.getUsername())
                    .password(appUser.getPassword())
                    .roles(appUser.getRole())
                    .build();
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    "/", "/signup", "/login",
                    "/register", "/search", "/search/**",
                    "/request"
                ).permitAll()

                .requestMatchers("/admin").hasRole("ADMIN")

.requestMatchers(
    "/donors", "/requests", "/requests/**"
).authenticated()
                .requestMatchers(
                    "/dashboard", "/donors/edit/**"
                ).authenticated()
.requestMatchers("/notifications", "/notifications/**").authenticated()
.requestMatchers("/h2-console/**").permitAll()
                .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .formLogin(form -> form
    .loginPage("/login")
    .permitAll()
)
            .logout(Customizer.withDefaults());

        return http.build();
    }
}