package com.example.server.controllers;

import com.example.server.dtos.location.CreateLocationRequest;
import com.example.server.entities.Event;
import com.example.server.entities.Group;
import com.example.server.entities.Location;
import com.example.server.entities.User;
import com.example.server.repositories.EventRepository;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.LocationRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/groups/{groupId}/events/{eventId}/locations")
public class LocationController {
    LocationRepository locationRepository;
    EventRepository eventRepository;
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    private final Map<Long, Object> userLocks = new ConcurrentHashMap<>();

    @Autowired
    public LocationController(
        LocationRepository locationRepository,
        EventRepository eventRepository,
        GroupRepository groupRepository,
        UserRepository userRepository,
        JwtUtils jwtUtils
    ) {
        this.locationRepository = locationRepository;
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLocations(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or group does not exist");
        }

        Event event = group.getEvent(eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized or event does not exist");
        }

        return ResponseEntity.ok().body(event.getLocations());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createLocation(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @Valid @RequestBody CreateLocationRequest body,
        HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or group does not exist");
        }

        Event event = group.getEvent(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or event does not exist");
        }

        for (Location loc : event.getLocations()) {
            if (loc.getVoters().stream().anyMatch(voter -> voter.getId().equals(userId))) {
                return ResponseEntity.badRequest().body("User has already voted");
            }
        }

        Location location = new Location(
                body.name,
                body.address,
                body.photoUrl,
                userRepository.getReferenceById(userId),
                event
        );
        locationRepository.save(location);
        event.addLocation(location);
        eventRepository.save(event);

        return ResponseEntity.ok().body("Location added successfully");
    }

    @PostMapping("/{locationId}/votes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> castVote(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @PathVariable("locationId") Long locationId,
        HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);

        userLocks.putIfAbsent(userId, new Object());
        Object userLock = userLocks.get(userId);

        synchronized (userLock) {
            try {
                Optional<Location> locationOptional = locationRepository.findById(locationId);
                if (locationOptional.isEmpty()) {
                    return ResponseEntity.badRequest().body("Location does not exist");
                }
                Location location = locationOptional.get();

                boolean userHasAccess = groupRepository.getReferenceById(groupId).getMembersAndOwner().stream()
                        .anyMatch(user -> {
                            System.out.println(user.getId());
                            return user.getId().equals(userId);
                        });

                if (!userHasAccess) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have access to group");
                }

                // user can vote if they have not suggested a location or voted already
                Event event = eventRepository.getReferenceById(eventId);
                for (Location loc : event.getLocations()) {
                    if (loc.getVoters().stream().anyMatch(voter -> voter.getId().equals(userId))) {
                        return ResponseEntity.badRequest().body("User has already voted");
                    }
                }

                Optional<Location> suggestedLocation = event.getLocations().stream()
                        .filter(loc -> loc.getCreator().getId().equals(userId))
                        .findFirst();

                if (suggestedLocation.isPresent()) {
                    return ResponseEntity.badRequest().body("User has already suggested a location");
                }

                location.getVoters().add(userRepository.getReferenceById(userId));
                locationRepository.save(location);

                return ResponseEntity.ok().body("Vote casted successfully");
            } finally {
                userLocks.remove(userId);
            }
        }
    }

    @DeleteMapping("/{locationId}/votes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteVote(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @PathVariable("locationId") Long locationId,
        HttpServletRequest req
    ) {
        Optional<User> userOptional = userRepository.findById(jwtUtils.getUserIdFromRequest(req));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User does not exist");
        }
        User user = userOptional.get();

        Group group = groupRepository.findJoined(user.getId(), groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or group does not exist");
        }

        Event event = group.getEvent(eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or event does not exist");
        }

        for (Location loc : event.getLocations()) {
            if (loc.getVoters().stream().anyMatch(voter -> voter.getId().equals(user.getId()))) {
                loc.deleteVoter(user);
                locationRepository.save(loc);
            }
        }

        return ResponseEntity.ok("Successfully deleted vote");
    }
}
