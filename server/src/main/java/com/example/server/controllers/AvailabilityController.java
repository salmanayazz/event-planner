package com.example.server.controllers;

import com.example.server.dtos.availability.SetAvailabilitiesRequest;
import com.example.server.entities.Availability;
import com.example.server.entities.Event;
import com.example.server.entities.Group;
import com.example.server.repositories.AvailabilityRepository;
import com.example.server.repositories.EventRepository;
import com.example.server.repositories.GroupRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Arrays;

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
    public ResponseEntity<?> setAvailabilities(
        @PathVariable("groupId") Long groupId,
        @PathVariable("eventId") Long eventId,
        @RequestBody SetAvailabilitiesRequest body,
        HttpServletRequest req
    ) {
        System.out.println(Arrays.toString(body.getTimes()));
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
            return ResponseEntity.badRequest().body("Unauthorized to access event or event does not exist");
        }

        ArrayList<Availability> availabilities = new ArrayList<>();
        for (Long time: body.getTimes()) {
            if (time <= event.getAvailabilityStartTime() ||
                time >= event.getAvailabilityEndTime()) {
                return ResponseEntity.badRequest().body("Availability time outside of event time range");
            }
            availabilities.add(new Availability(
                event,
                userRepository.getReferenceById(userId),
                time
            ));
        }

        availabilityRepository.saveAll(availabilities);
        event.setAvailabilities(availabilities);
        eventRepository.save(event);

        return ResponseEntity.ok().body("Successfully created availability");
    }
}
