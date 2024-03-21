package com.example.server.controllers;

import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping
  public Iterable<User> findAllUsers() {
    return this.userRepository.findAll();
  }

  @PostMapping
  public ResponseEntity<?> addUser(@RequestBody User user) {
    try {
      User savedUser = userRepository.save(user);
      return ResponseEntity.ok(savedUser);
    } catch (DataIntegrityViolationException e) {
      // duplicate email constraint violation
      String errorMessage = "Failed to add user: Email address already exists.";
      return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }
  }
}
