package com.example.server.controllers;

import com.example.server.dtos.event.CreateEventRequest;
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
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/groups/{groupId}/events")
public class EventController {
    LocationRepository locationRepository;
    EventRepository eventRepository;
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    @Autowired
    public EventController(LocationRepository locationRepository, EventRepository eventRepository, GroupRepository groupRepository, UserRepository userRepository, JwtUtils jwtUtils) {
        this.locationRepository = locationRepository;
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getEvents(@PathVariable("groupId") Long groupId, HttpServletRequest req) {
        Long userId = jwtUtils.getUserIdFromRequest(req);

        if (groupRepository.findJoined(userId, groupId) == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access group or group does not exist");
        }

        return ResponseEntity.ok().body(groupRepository.findById(groupId).get().getEvents());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createEvent(@PathVariable("groupId") Long groupId, @Valid @RequestBody CreateEventRequest body, HttpServletRequest req) {
        Long userId = jwtUtils.getUserIdFromRequest(req);

        System.out.println(body.toString());

        Optional<Group> groupOptional = groupRepository.findById(groupId);
        if (groupOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Unauthorized to access group or group does not exist");
        }

        CreateLocationRequest locationRequest = body.getLocation();;
        Location location = null;
        if (locationRequest != null) {
            location = new Location(locationRequest.name, locationRequest.address, locationRequest.photoUrl, userRepository.getReferenceById(userId), null);
            locationRepository.save(location);
        }
        Group group = groupOptional.get();
        Event event = new Event(
            body.getName(),
            body.getStartTime(),
            body.getEndTime(),
            body.getAvailabilityStartTime(),
            body.getAvailabilityEndTime(),
            body.getVotingEndTime(),
            location,
            group,
            userRepository.getReferenceById(userId)
        );
        eventRepository.save(event);
        System.out.println(event);
        group.addEvent(event);
        groupRepository.save(group);

        if (location != null) {
            location.setEvent(event);
            locationRepository.save(location);
        }

        return ResponseEntity.ok().body("Event created successfully");
    }

    @Scheduled(cron = "0 */5 * * * *")
    public void selectEventLocation() {
        for (Event event: eventRepository.findAll()) {
            if (event.getVotingEndTime() > Instant.now().toEpochMilli() ||
                event.getVotingCompleted()) {
                return;
            }
            Location maxVoted = event.getLocations().get(0);
            for (Location location: event.getLocations()) {
                if (location.getVoters().size() > maxVoted.getVoters().size()) {
                    maxVoted = location;
                }
            }
            event.setSelectedLocation(maxVoted);
            event.setVotingCompleted(true);
            eventRepository.save(event);
        }
    }
}
