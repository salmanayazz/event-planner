package com.example.server.controllers;

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

        GetGroupsResponse[] res = new GetGroupsResponse[groups.length];
        for (int i = 0; i < groups.length; i++) {
            res[i] = new GetGroupsResponse();
            res[i].id = groups[i].getId();
            res[i].name = groups[i].getName();
            res[i].owner = groups[i].getOwner().getUsername();
            res[i].members = groups[i].getMembers().stream().map(User::getUsername).collect(Collectors.toList());
        }

        return ResponseEntity.ok().body(res);

    }

    static class GetGroupsResponse { // TODO: move to a separate file
        public Long id;
        public String name;
        public String owner;
        public List<String> members;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createGroups(@Valid @RequestBody CreateGroupsRequest req, HttpServletRequest request) {
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

    static class CreateGroupsRequest {
        public String name;
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

        Group group = groupRepository.findIfJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Group not found");
        }

        User user = userRepository.findByUsername(req.username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        group.addMember(user);
        groupRepository.save(group);
        return ResponseEntity.ok().body("User added to group successfully");
    }

    static class AddUserRequest {
        public String username;
    }
}
