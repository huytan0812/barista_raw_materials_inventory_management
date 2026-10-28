package com.bar_raw_materials.controllers;

import com.bar_raw_materials.config.UserDetailsServiceImpl.UserDetailsImpl;
import com.bar_raw_materials.entities.Role;
import com.bar_raw_materials.entities.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockPart;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Role-based authorization of the staff API: admin-only endpoints, self-or-admin account endpoints,
 * and the 403 response format. Runs through the real security filter chain against H2.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthorizationTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private PlatformTransactionManager transactionManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PersistenceContext
    private EntityManager entityManager;

    private TransactionTemplate tx;
    private Role adminRole;
    private Role staffRole;
    private User admin;
    private User staff;

    @BeforeEach
    void createUsers() {
        tx = new TransactionTemplate(transactionManager);
        tx.executeWithoutResult(status -> {
            adminRole = createRole("admin");
            staffRole = createRole("staff");
            admin = createUser("admin", adminRole, "0900000001");
            staff = createUser("staff", staffRole, "0900000002");
        });
    }

    @AfterEach
    void cleanUp() {
        tx.executeWithoutResult(status -> {
            entityManager.createQuery("DELETE FROM User").executeUpdate();
            entityManager.createQuery("DELETE FROM Role").executeUpdate();
        });
    }

    @Test
    void unauthenticatedRequestsAreRejected() throws Exception {
        mockMvc.perform(get("/api/staff/user/list"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void onlyAdminCanListAccounts() throws Exception {
        mockMvc.perform(get("/api/staff/user/list").with(as(staff)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.accessDenied").isNotEmpty());
        mockMvc.perform(get("/api/staff/user/all").with(as(staff)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/staff/user/list").with(as(admin)))
                .andExpect(status().isOk())
                // the BCrypt hash must never be serialized
                .andExpect(content().string(not(containsString("password"))))
                .andExpect(content().string(not(containsString("$2a$"))));
    }

    @Test
    void userDetailsAreLimitedToSelfOrAdmin() throws Exception {
        mockMvc.perform(get("/api/staff/user/details/{id}", admin.getId()).with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/staff/user/details/{id}", staff.getId()).with(as(staff)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/staff/user/details/{id}", staff.getId()).with(as(admin)))
                .andExpect(status().isOk());
    }

    @Test
    void staffCannotResetAnotherUsersPassword() throws Exception {
        String body = "{\"password\":\"new-password\",\"confirmPassword\":\"new-password\"}";

        mockMvc.perform(post("/api/staff/user/resetPassword/{id}", admin.getId()).with(as(staff))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/staff/user/checkPassword/{id}", admin.getId()).with(as(staff))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"password\":\"secret\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/staff/user/resetPassword/{id}", staff.getId()).with(as(staff))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/staff/user/resetPassword/{id}", staff.getId()).with(as(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());
    }

    @Test
    void staffCanEditOwnProfileButNotRoleOrStatus() throws Exception {
        mockMvc.perform(multipart("/api/staff/user/update/{id}", staff.getId())
                        .part(editUserPart(staff, staffRole, true)).with(as(staff)))
                .andExpect(status().isOk());

        mockMvc.perform(multipart("/api/staff/user/update/{id}", staff.getId())
                        .part(editUserPart(staff, adminRole, true)).with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(multipart("/api/staff/user/update/{id}", admin.getId())
                        .part(editUserPart(admin, adminRole, true)).with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(multipart("/api/staff/user/add").part(jsonPart("{}")).with(as(staff)))
                .andExpect(status().isForbidden());

        // an admin may change another account's role
        mockMvc.perform(multipart("/api/staff/user/update/{id}", staff.getId())
                        .part(editUserPart(staff, adminRole, false)).with(as(admin)))
                .andExpect(status().isOk());
    }

    @Test
    void adminOnlyBusinessEndpointsRejectStaff() throws Exception {
        mockMvc.perform(get("/api/staff/grn/confirm/{id}", 1).with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/staff/productInventory/vatOverall").with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/staff/productInventory/allProductVAT").with(as(staff)))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/staff/businessPeriod/endPeriod").with(as(staff)))
                .andExpect(status().isForbidden());

        // passes authorization for an admin; the receipt does not exist
        mockMvc.perform(get("/api/staff/grn/confirm/{id}", 1).with(as(admin)))
                .andExpect(status().isNotFound());
    }

    @Test
    void staffKeepsAccessToNonAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/staff/user/lightInfo").with(as(staff)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/staff/user/allRole").with(as(staff)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/staff/category/list").with(as(staff)))
                .andExpect(status().isOk());
    }

    private static RequestPostProcessor as(User user) {
        return user(new UserDetailsImpl(user));
    }

    private static MockPart editUserPart(User user, Role role, boolean isActive) {
        String json = String.format(
                "{\"username\":\"%s\",\"firstName\":\"First\",\"lastName\":\"Last\",\"email\":\"%s\","
                        + "\"phoneNumber\":\"%s\",\"gender\":false,\"isActive\":%s,\"roleId\":%d}",
                user.getUsername(), user.getEmail(), user.getPhoneNumber(), isActive, role.getId());
        return jsonPart(json);
    }

    private static MockPart jsonPart(String json) {
        MockPart part = new MockPart("data", json.getBytes());
        part.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        return part;
    }

    private Role createRole(String name) {
        Role role = new Role();
        role.setRole(name);
        entityManager.persist(role);
        return role;
    }

    private User createUser(String username, Role role, String phoneNumber) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode("secret"));
        user.setFirstName("First");
        user.setLastName("Last");
        user.setEmail(username + "@example.com");
        user.setPhoneNumber(phoneNumber);
        user.setIsActive(true);
        user.setRole(role);
        user.setTokenVersion(0);
        entityManager.persist(user);
        return user;
    }
}
