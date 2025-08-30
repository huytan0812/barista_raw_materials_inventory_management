package com.bar_raw_materials.services.user;

import com.bar_raw_materials.entities.User;
import com.bar_raw_materials.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public Page<User> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.pagination(pageable);
    }

    @Override
    public User getDetails(int id) {
        return userRepository.findById(id);
    }
}
