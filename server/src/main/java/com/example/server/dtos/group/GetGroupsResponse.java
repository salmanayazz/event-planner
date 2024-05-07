package com.example.server.dtos.group;

import com.example.server.entities.User;

import java.util.List;

public class GetGroupsResponse {
    public Long id;
    public String name;
    public User owner;
    public List<User> members;
}
