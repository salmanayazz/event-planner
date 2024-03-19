package com.example.server;

import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }
  
  @GetMapping("/users")
  public Iterable<User> findAllUsers() {
    return this.userRepository.findAll();
  }

  @PostMapping("/users")
  public User addOneUser(@RequestBody User user) {
    return this.userRepository.save(user);
  }
}