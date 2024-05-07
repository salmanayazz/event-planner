package com.example.server.controllers;

import com.example.server.entities.Event;
import com.example.server.entities.Group;
import com.example.server.entities.Location;
import com.example.server.repositories.EventRepository;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.LocationRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/groups/{groupId}/events/{eventId}/locations")
public class LocationController {
    LocationRepository locationRepository;
    EventRepository eventRepository;
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    @Autowired
    public LocationController(LocationRepository locationRepository, EventRepository eventRepository, GroupRepository groupRepository, UserRepository userRepository, JwtUtils jwtUtils) {
        this.locationRepository = locationRepository;
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLocations(@PathVariable("groupId") Long groupId, @PathVariable("eventId") Long eventId, HttpServletRequest req) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized or group does not exist");
        }

        Event event = eventRepository.findEventInGroup(groupId, eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized or event does not exist");
        }

        return ResponseEntity.ok().body(locationRepository.getLocationsInEvent(eventId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createLocation(@PathVariable("groupId") Long groupId, @PathVariable("eventId") Long eventId, @Valid @RequestBody CreateLocationRequest body, HttpServletRequest req) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized or group does not exist");
        }

        Event event = eventRepository.findEventInGroup(groupId, eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized or event does not exist");
        }

        Location location = new Location(
                body.name,
                body.address,
                body.photoUrl,
                event,
                userRepository.getReferenceById(userId)
        );
        locationRepository.save(location);
        return ResponseEntity.ok().body("Location added successfully");
    }

    static class CreateLocationRequest {
        public String name;
        public String address;
        public String photoUrl;
    }
}
