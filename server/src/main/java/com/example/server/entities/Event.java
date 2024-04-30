package com.example.server.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max = 20)
    private String name;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @NotNull
    private Group group;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @NotNull
    private User creator;

    public Event(String name, Long creatorId, Long groupId) {
        this.name = name;
        this.creator = new User();
        this.creator.setId(creatorId);
        this.group = new Group();
        this.group.setId(groupId);
    }

    public Event() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public User getCreator() {
        return creator;
    }

    public Group getGroup() {
        return group;
    }
}
