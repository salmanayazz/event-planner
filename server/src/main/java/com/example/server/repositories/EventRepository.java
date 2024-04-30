package com.example.server.repositories;

import com.example.server.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE e.group.id = :groupId")
    List<Event> findEventsInGroup(@Param("groupId") Long groupId);

    @Query("SELECT e FROM Event e WHERE e.group.id = :groupId AND e.id = :eventId")
    Event findEventInGroup(@Param("groupId") Long groupId, @Param("eventId") Long eventId);
}
