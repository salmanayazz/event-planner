package com.example.server.repositories;

import com.example.server.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT l FROM Location l LEFT JOIN l.event e WHERE e.id = :eventId")
    List<Location> getLocationsInEvent(@Param("eventId") Long eventId);
}
