package com.example.server.controllers;

import com.example.server.dtos.group.AddUserRequest;
import com.example.server.dtos.group.CreateGroupRequest;
import com.example.server.entities.Group;
import com.example.server.entities.User;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/groups")
public class GroupController {
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    @Autowired
    public GroupController(GroupRepository groupRepository, UserRepository userRepository, JwtUtils jwtUtils) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getGroups(HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        return ResponseEntity.ok().body(groupRepository.findByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createGroups(@Valid @RequestBody CreateGroupRequest req, HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);

        Group group = new Group();
        group.setName(req.name);
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        group.setOwner(user.get());
        groupRepository.save(group);
        return ResponseEntity.ok().body("Group created successfully");
    }

    @PostMapping("/{groupId}/users")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addUser(@PathVariable("groupId") String groupIdString, @Valid @RequestBody AddUserRequest req, HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);

        Long groupId = null;
        try {
            groupId = Long.parseLong(groupIdString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid group ID");
        }

        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized or group not found");
        }

        User user = userRepository.findByUsername(req.username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (Objects.equals(group.getOwner().getId(), user.getId()) || group.getMembers().contains(user)) {
            return ResponseEntity.badRequest().body("User already added");
        }

        group.addMember(user);
        groupRepository.save(group);
        return ResponseEntity.ok().body("User added to group successfully");
    }

    @DeleteMapping("/{groupId}/users/{userId}")
    @PreAuthorize("hasRole('USER')")
    ResponseEntity<?> removeUser(@PathVariable("groupId") String groupIdString, @PathVariable("userId") String userIdToRemoveString, HttpServletRequest request) {
        Long groupId = null;
        Long userIdToRemove = null;
        try {
            groupId = Long.parseLong(groupIdString);
            userIdToRemove = Long.parseLong(userIdToRemoveString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid group or user ID");
        }

        Long userId = jwtUtils.getUserIdFromRequest(request);
        Group group = groupRepository.findOwned(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized or group not found");
        }

        List<User> members = group.getMembers();
        for (User member: members) {
            if (Objects.equals(member.getId(), userIdToRemove)) {
                members.remove(member);
                group.setMembers(members);
                groupRepository.save(group);
                break;
            }
        }

        return ResponseEntity.ok().body("Removed user from group successfully");
    }
}
