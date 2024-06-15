package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max = 20)
    private String name;
    private Long startTime;
    private Long endTime;
    private Long availabilityStartTime;
    private Long availabilityEndTime;
    private Long votingEndTime;
    private Boolean votingCompleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    @JsonIgnore
    private Group group;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @NotNull
    private User creator;

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Location> locations = new ArrayList<>();

    @OneToOne
    private Location selectedLocation;

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Availability> availabilities = new ArrayList<>();

    public Event() {}
    public Event(
        String name,
        Long startTime,
        Long endTime,
        Long availabilityStartTime,
        Long availabilityEndTime,
        Long votingEndTime,
        Location selectedLocation,
        Group group,
        User creator
    ) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.availabilityStartTime = availabilityStartTime;
        this.availabilityEndTime = availabilityEndTime;
        this.votingEndTime = votingEndTime;
        this.selectedLocation = selectedLocation;
        this.group = group;
        this.creator = creator;
    }

    public void addLocation(Location location) {
        locations.add(location);
    }

    public String toString() {
        return "Event{" +
            "id=" + id +
            ", name='" + name +
            ", startTime=" + startTime +
            ", endTime=" + endTime +
            ", availabilityStartTime=" + availabilityStartTime +
            ", availabilityEndTime=" + availabilityEndTime +
            ", group=" + group +
            ", creator=" + creator +
            '}';
    }
}
