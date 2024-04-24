package com.example.server.controllers;

import com.example.server.entities.Group;
import com.example.server.entities.User;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/groups")
public class GroupController {
    @Autowired
    GroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getGroups(HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);
        System.out.println("User ID: " + userId);
        Group[] groups = groupRepository.findByUserId(userId).toArray(new Group[0]);

        GroupResponse[] groupResponses = new GroupResponse[groups.length];
        for (int i = 0; i < groups.length; i++) {
            groupResponses[i] = new GroupResponse();
            groupResponses[i].id = groups[i].getId();
            groupResponses[i].name = groups[i].getName();
            groupResponses[i].owner = groups[i].getOwner().getUsername();
            //groupResponses[i].members = groups[i].getMembers().stream().map(user -> user.getName()).collect(Collectors.toList());
        }

        return ResponseEntity.ok().body(groupResponses);

    }

    class GroupResponse {
        public Long id;
        public String name;
        public String owner;
        //public List<String> members;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createGroups(@RequestBody String name, HttpServletRequest request) {
        Long userId = jwtUtils.getUserIdFromRequest(request);

        Group group = new Group();
        group.setName(name);
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            group.setOwner(user.get());
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
        System.out.println(groupRepository.findByUserId(userId));
        groupRepository.save(group);
        return ResponseEntity.ok().body("Group created successfully");
    }

    @PostMapping("/{groupId}/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addUserToGroup(@RequestBody Long userId, @PathVariable String groupIdString, HttpServletRequest request) {
        Long groupId = 0L;
        try {
            groupId = Long.parseLong(groupIdString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid group ID");
        }
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                group.addMember(user);
                groupRepository.save(group);
            } else {
                // Handle case when user is not found
            }
        } else {
            // Handle case when group is not found
        }
        return ResponseEntity.ok().body("User added to group successfully");
    }

}
