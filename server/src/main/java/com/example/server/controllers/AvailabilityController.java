package com.example.server.controllers;

import com.example.server.dtos.availability.CreateAvailabilityRequest;
import com.example.server.entities.Availability;
import com.example.server.entities.Event;
import com.example.server.entities.Group;
import com.example.server.entities.User;
import com.example.server.repositories.AvailabilityRepository;
import com.example.server.repositories.EventRepository;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/groups/{groupId}/events/{eventId}/availabilities")
public class AvailabilityController {
    AvailabilityRepository availabilityRepository;
    EventRepository eventRepository;
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    @Autowired
    public AvailabilityController(
        AvailabilityRepository availabilityRepository,
        EventRepository eventRepository,
        GroupRepository groupRepository,
        UserRepository userRepository,
        JwtUtils jwtUtils
    ) {
        this.availabilityRepository = availabilityRepository;
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping
    public ResponseEntity<?> createAvailability(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @RequestBody CreateAvailabilityRequest body,
        HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access group or group does not exist");
        }

        Event event = group.getEvent(eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access event or event does not exist");
        }

        if (event.getVotingCompleted()) {
            return ResponseEntity.badRequest().body("Event voting has concluded");
        }

        // find availability that matches time in event 
        Availability availability = event.getAvailabilities().stream().filter(a -> 
            a.getTime().equals(body.getTime())
        ).findFirst().orElse(null);

        if (body.getTime() <= event.getAvailabilityStartTime() ||
            body.getTime() >= event.getAvailabilityEndTime()) {
            return ResponseEntity.badRequest().body("Availability time outside of event time range");
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User does not exist");
        } else if (availability == null) {
            availability = new Availability(
                event,
                body.getTime()
            );
            availabilityRepository.save(availability);
            event.addAvailability(availability);
            eventRepository.save(event);
        } else if (availability.getUsers().contains(user.get())) {
            return ResponseEntity.badRequest().body("User has already set availability for this time");
        }

        availability.addUser(user.get());
        availabilityRepository.save(availability);

        return ResponseEntity.ok().body("Successfully created availability");
    }

    @DeleteMapping("/{availabilityTime}")
    public ResponseEntity<?> deleteAvailability(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @PathVariable("availabilityTime") Long availabilityTime,
        HttpServletRequest req
    ) {
        Long userId = jwtUtils.getUserIdFromRequest(req);
        Group group = groupRepository.findJoined(userId, groupId);
        if (group == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access group or group does not exist");
        }

        Event event = group.getEvent(eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access event or event does not exist");
        }

        if (event.getVotingCompleted()) {
            return ResponseEntity.badRequest().body("Event voting has concluded");
        }

        // find availability that matches time in event
        Availability availability = event.getAvailabilities().stream().filter(a ->
            a.getTime().equals(availabilityTime)
        ).findFirst().orElse(null);

        User user = userRepository.getReferenceById(userId);
        if (availability == null) {
            return ResponseEntity.badRequest().body("Cannot delete availability as it does not exist1");
        }

        if (!availability.getUsers().contains(user)) {
            return ResponseEntity.badRequest().body("Cannot delete availability as it does not exist2");
        }

        availability.removeUser(user);
        availabilityRepository.save(availability);

        return ResponseEntity.ok().body("Successfully deleted availability");
    }
}
