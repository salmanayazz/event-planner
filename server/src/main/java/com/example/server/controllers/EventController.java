package com.example.server.controllers;

import com.example.server.dtos.event.CreateEventRequest;
import com.example.server.dtos.event.GetEventsResponse;
import com.example.server.entities.Event;
import com.example.server.repositories.EventRepository;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/groups/{groupId}/events")
public class EventController {
    EventRepository eventRepository;
    GroupRepository groupRepository;
    UserRepository userRepository;
    JwtUtils jwtUtils;

    @Autowired
    public EventController(EventRepository eventRepository, GroupRepository groupRepository, UserRepository userRepository, JwtUtils jwtUtils) {
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

        List<Event> events = eventRepository.findEventsInGroup(groupId);
        List<GetEventsResponse> res = new ArrayList<>();
        for (Event event: events) {
            GetEventsResponse eventsResponse = new GetEventsResponse();
            eventsResponse.id = event.getId();
            eventsResponse.name = event.getName();
            eventsResponse.creatorId = event.getCreator().getId();
            eventsResponse.groupId = event.getGroup().getId();
            res.add(eventsResponse);
        }

        return ResponseEntity.ok().body(res);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createEvent(@PathVariable("groupId") Long groupId, @Valid @RequestBody CreateEventRequest body, HttpServletRequest req) {
        Long userId = jwtUtils.getUserIdFromRequest(req);

        if (groupRepository.findJoined(userId, groupId) == null) {
            return ResponseEntity.badRequest().body("Unauthorized to access group or group does not exist");
        }

        Event event = new Event(body.name, userId, groupId);
        eventRepository.save(event);

        return ResponseEntity.ok().body("Event created successfully");
    }
}
