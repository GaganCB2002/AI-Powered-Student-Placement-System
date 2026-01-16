package com.aipsms.backend.payload.request;

import com.aipsms.backend.entity.User.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}
