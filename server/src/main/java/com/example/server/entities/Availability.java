package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "availability")
@Getter
@Setter
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @NotNull
    @JsonIgnore
    private Event event;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "availability_users",
        joinColumns = @JoinColumn(name = "availability_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @NotNull
    private List<User> users = new ArrayList<>();

    @NotNull
    private Long time;

    public Availability() {}
    public Availability(Event event, Long time) {
        this.event = event;
        this.time = time;
    }

    public void addUser(User user) {
        this.users.add(user);
    }

    public void removeUser(User user) {
        this.users.remove(user);
    }

    public String toString() {
        return "Availability(id=" + this.id + ", users=" + this.users + ", time=" + this.time + ")";
    }
}
