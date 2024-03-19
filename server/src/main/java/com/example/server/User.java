package com.example.server;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;
  private String email;
  private String password;
  private String name;

  
  public User(String email, String password, String name) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  public User() {}

  public Integer getId() {
    return this.id;
  }
  public String getEmail() {
    return this.email;
  }
  public String getPassword() {
    return this.password;
  }
  public String getName() {
    return this.name;
  }
}