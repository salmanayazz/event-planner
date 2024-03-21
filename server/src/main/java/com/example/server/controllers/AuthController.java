package com.example.server.controllers;

import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody Map<String, String> requestData
    ) {
        String email = requestData.get("email");
        String password = requestData.get("password");
        String name = requestData.get("name");

        try {
            // hash the password while saving user
            User user = new User(email, passwordEncoder.encode(password), name);
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (DataIntegrityViolationException e) {
            // handle duplicate email violation
            String errorMessage = "Failed to register user: Email address already exists.";
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody Map<String, String> requestData,
            HttpSession session
    ) {
        String email = requestData.get("email");
        String password = requestData.get("password");
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            // authenticated successfully
            session.setAttribute("userId", user.getId());
            return ResponseEntity.ok("Login successful");
        } else {
            // invalid credentials
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    // test endpoint to see if sessions work
    @PostMapping()
    public String test() {
        return "works";
    }
}