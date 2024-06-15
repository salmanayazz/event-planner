package com.example.server.dtos.availability;

import lombok.Getter;

@Getter
public class SetAvailabilitiesRequest {
    Long[] times;
}
