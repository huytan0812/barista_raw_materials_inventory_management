package com.bar_raw_materials.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bar_raw_materials.entities.User;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query(
            value="SELECT u FROM User u JOIN FETCH u.role " +
                    "WHERE u.username=:username"
    )
    User findByUsername(String username);

    @Query(
            value="SELECT u FROM User u JOIN FETCH u.role " +
                    "WHERE u.id=:id"
    )
    User findById(int id);

//    @Query(
//            value="SELECT u FROM User u JOIN FETCH u.role ORDER BY u.id ASC"
//    )
//    User findAllOrderByUserIdAsc();
}
