package com.example.server.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.ArrayList;

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

    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

    public void setName(String name) {
        this.name = name;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void addMember(User user) {
        this.members.add(user);
    }

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
}

