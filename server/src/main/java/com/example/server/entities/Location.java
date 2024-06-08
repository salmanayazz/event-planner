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
@Table(name = "locations")
@Getter
@Setter
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

    @Column(length = 500)
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @NotNull
    private User creator;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "location_voters",
        joinColumns = @JoinColumn(name = "location_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> voters = new ArrayList<>();

    public Location() {}
    public Location(String name, String address, String photoUrl, User creator, Event event) {
        this.name = name;
        this.address = address;
        this.photoUrl = photoUrl;
        this.creator = creator;
        this.event = event;
    }

    public void deleteVoter(User user) {
        voters.remove(user);
    }
}
