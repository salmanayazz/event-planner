package com.example.server.controllers;

import com.example.server.dtos.auth.AuthErrorResponse;
import com.example.server.dtos.auth.JwtResponse;
import com.example.server.dtos.auth.LoginRequest;
import com.example.server.dtos.auth.SignupRequest;
import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import com.example.server.security.services.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    PasswordEncoder encoder;
    JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Long user = userRepository.findUserIdByEmail(loginRequest.getEmail());

        if (user == null) {
            AuthErrorResponse authErrorResponse = new AuthErrorResponse();
            authErrorResponse.setEmail("No user exists by this email");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(authErrorResponse);
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    // get userId from email, as userId acts as the spring security username
                    user,
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail()));
        } catch (BadCredentialsException e) {
            AuthErrorResponse authErrorResponse = new AuthErrorResponse();
            authErrorResponse.setPassword("Incorrect password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(authErrorResponse);
        }
    }

    @GetMapping("/login")
    public ResponseEntity<?> checkAuthenticated(HttpServletRequest req) {
        Optional<User> userOptional = userRepository.findById(jwtUtils.getUserIdFromRequest(req));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User does not exist");
        }

        return ResponseEntity.ok(userOptional.get());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        AuthErrorResponse authErrorResponse = new AuthErrorResponse();
        HttpStatus status = HttpStatus.OK;

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            authErrorResponse.setUsername("Username is already taken");
            status = HttpStatus.BAD_REQUEST;
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            authErrorResponse.setEmail("Email is already in use");
            status = HttpStatus.BAD_REQUEST;
        }

        if (status != HttpStatus.OK) {
            return ResponseEntity.status(status).body(authErrorResponse);
        }

        // create new user's account
        User user = new User(
            signUpRequest.getUsername(), 
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword())
        );

        userRepository.save(user);
        return ResponseEntity.status(status).body("User registered successfully");
    }
}