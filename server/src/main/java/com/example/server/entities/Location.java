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

    @Column(length = 500)
    private String photoUrl;

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
    public Location(String name, String address, String photoUrl, User creator) {
        this.name = name;
        this.address = address;
        this.photoUrl = photoUrl;
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
    public String getPhotoUrl() {
        return photoUrl;
    }

    public User getCreator() {
        return creator;
    }

    public List<User> getVoters() {
        return voters;
    }
}
