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
    @Autowired
    LocationRepository locationRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLocations(@PathVariable("groupId") String groupIdString, @PathVariable("eventId") String eventIdString, HttpServletRequest request) {
        Long groupId = null;
        Long eventId = null;
        try {
            groupId = Long.parseLong(groupIdString);
            eventId = Long.parseLong(eventIdString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid group or event ID");
        }

        Long userId = jwtUtils.getUserIdFromRequest(request);
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
    public ResponseEntity<?> createLocation(@PathVariable("groupId") String groupIdString, @PathVariable("eventId") String eventIdString, @Valid @RequestBody CreateLocationRequest req, HttpServletRequest request) {
        Long groupId = null;
        Long eventId = null;
        try {
            groupId = Long.parseLong(groupIdString);
            eventId = Long.parseLong(eventIdString);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid group or event ID");
        }

        Long userId = jwtUtils.getUserIdFromRequest(request);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized or group does not exist");
        }

        Event event = eventRepository.findEventInGroup(groupId, eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized or event does not exist");
        }

        Location location = new Location(
                req.name,
                req.address,
                event,
                userRepository.getReferenceById(userId)
        );
        locationRepository.save(location);
        return ResponseEntity.ok().body("Location added successfully");
    }

    static class CreateLocationRequest {
        public String name;
        public String address;
    }
}
