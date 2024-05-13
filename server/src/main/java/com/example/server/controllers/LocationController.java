package com.example.server.controllers;

import com.example.server.dtos.location.CreateLocationRequest;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

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

        Event event = eventRepository.findEventInGroup(groupId, eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized or event does not exist");
        }

        return ResponseEntity.ok().body(locationRepository.getLocationsInEvent(eventId));
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

        Event event = eventRepository.findEventInGroup(groupId, eventId);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized or event does not exist");
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

    @PostMapping("/{locationId}/vote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> castVote(
            @PathVariable("groupId") Long groupId,
            @PathVariable("eventId") Long eventId,
            @PathVariable("locationId") Long locationId,
            HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Optional<Location> locationOptional = locationRepository.findById(locationId);
        if (locationOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Location does not exist");
        }

        Location location = locationOptional.get();

        boolean userHasAccess = location.getEvent().getGroup().getAllUsers().stream()
                .anyMatch(user -> {
                    System.out.println(user.getId());
                    return user.getId().equals(userId);
                });

        if (!userHasAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have access to group");
        }

        // user can vote if they have not suggested a location or voted already
        boolean userHasVoted = false;
        for (Location loc: locationRepository.getLocationsInEvent(eventId)) {
            if (loc.getVoters().stream().anyMatch(voter -> voter.getId().equals(userId))) {
                userHasVoted = true;
                break;
            }
        }

        if (userHasVoted) {
            return ResponseEntity.badRequest().body("User has already voted");
        }

        Optional<Location> suggestedLocation = locationRepository.getLocationsInEvent(eventId).stream()
                .filter(loc -> loc.getCreator().getId().equals(userId))
                .findFirst();

        if (suggestedLocation.isPresent()) {
            return ResponseEntity.badRequest().body("User has already suggested a location");
        }

        location.getVoters().add(userRepository.getReferenceById(userId));
        locationRepository.save(location);

        return ResponseEntity.ok().body("Vote casted successfully");
    }

}
