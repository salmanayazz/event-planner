package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max = 20)
    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "group_events",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    @JsonIgnore
    private List<Event> events = new ArrayList<>();

    public String toString() {
        return "Group{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", owner=" + owner +
            ", members=" + members +
            '}';
    }

    public List<User> getMembers() { 
        return members;
    }

    @JsonIgnore
    public List<User> getMembersAndOwner() {
        List<User> allUsers = new ArrayList<>(members);
        allUsers.add(owner);
        return allUsers;
    }

    public List<Event> getEvents() {
        return events;
    }

    public Event getEvent(Long eventId) {
        return events.stream()
            .filter(e -> e.getId().equals(eventId))
            .findFirst()
            .orElse(null);
    }

    public User getOwner() {
        return owner;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void addMember(User user) {
        this.members.add(user);
    }

    public void addEvent(Event event) {
        this.events.add(event);
    }

}

