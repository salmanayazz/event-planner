package com.example.server.dtos.event;

import com.example.server.dtos.location.CreateLocationRequest;
import lombok.Getter;

@Getter
public class CreateEventRequest {
    private String name;
    private Long startTime;
    private Long endTime;
    private Long availabilityStartTime;
    private Long availabilityEndTime;
    private CreateLocationRequest location;
    private Long votingEndTime;
}
