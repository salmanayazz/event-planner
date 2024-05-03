package com.example.server.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max = 20)
    @NotNull
    private String name;

    @Size(max = 50)
    @NotNull
    private String address;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @NotNull
    private User creator;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @NotNull
    private Event event;

    @ManyToMany
    @JoinTable(
            name = "location_voters",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> voters = new ArrayList<>();

    public Location() {}
    public Location(String name, String address, Event event, User creator) {
        this.name = name;
        this.address = address;
        this.event = event;
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public User getCreator() {
        return creator;
    }

    public Event getEvent() {
        return event;
    }

    public List<User> getVoters() {
        return voters;
    }
}
