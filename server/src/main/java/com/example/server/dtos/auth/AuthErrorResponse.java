package com.example.server.dtos.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthErrorResponse {
    String username;
    String email;
    String password;
    String message;
}
