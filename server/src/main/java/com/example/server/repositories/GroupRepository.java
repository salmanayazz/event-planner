package com.example.server.repositories;

import com.example.server.entities.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    @Query("SELECT DISTINCT g FROM Group g LEFT JOIN g.members m WHERE g.owner.id = :id OR m.id = :id")
    List<Group> findByUserId(@Param("id") Long id);

    @Query("SELECT g FROM Group g WHERE g.owner.id = :userId AND g.id = :groupId")
    Group findOwned(@Param("userId") Long userId, @Param("groupId") Long groupId);

    @Query("SELECT g FROM Group g LEFT JOIN g.members m WHERE (g.owner.id = :userId OR m.id = :userId) AND g.id = :groupId")
    Group findJoined(@Param("userId") Long userId, @Param("groupId") Long groupId);
}
