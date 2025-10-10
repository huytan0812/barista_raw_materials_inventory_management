package com.bar_raw_materials.repositories;

import com.bar_raw_materials.dto.user.LightUserDTO;
import com.bar_raw_materials.entities.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bar_raw_materials.entities.User;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

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

    @Query(
            value="SELECT u FROM User u JOIN FETCH u.role"
    )
    Page<User> pagination(Pageable pageable);
    
    User findByPhoneNumber(String phoneNumber);
    User findByEmail(String email);

    @Query(
            value="SELECT r FROM Role r"
    )
    List<Role> findAllRole();

    @Query(
            value="SELECT r FROM Role r WHERE r.id=:id"
    )
    Role findRoleById(int id);

//    @Query(
//            value="SELECT u FROM User u JOIN FETCH u.role ORDER BY u.id ASC"
//    )
//    User findAllOrderByUserIdAsc();
}
