package com.bar_raw_materials.config;

import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.io.Decoders;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Checks the configuration that must come from environment variables (or a local .env file)
 * before any bean is created, so a missing or weak secret stops the application with a clear
 * message instead of an obscure database or JWT signing error later on.
 * Registered in META-INF/spring.factories.
 */
public class RequiredConfigurationValidator implements EnvironmentPostProcessor, Ordered {
    // JwtService signs tokens with HS256, which requires a key of at least 256 bits
    static final int MIN_JWT_SECRET_KEY_BYTES = 32;
    static final String JWT_SECRET_KEY_PROPERTY = "application.security.jwt.secret-key";

    // property name -> environment variable that is expected to provide it
    private static final Map<String, String> REQUIRED_PROPERTIES = new LinkedHashMap<>();
    static {
        REQUIRED_PROPERTIES.put("spring.datasource.url", "DB_URL");
        REQUIRED_PROPERTIES.put("spring.datasource.username", "DB_USERNAME");
        REQUIRED_PROPERTIES.put("spring.datasource.password", "DB_PASSWORD");
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        List<String> problems = new ArrayList<>();

        REQUIRED_PROPERTIES.forEach((property, envVar) -> {
            String value = resolve(environment, property);
            // an empty password is allowed (e.g. a local root account without password)
            boolean missing = value == null || (value.isBlank() && !envVar.equals("DB_PASSWORD"));
            if (missing) {
                problems.add(envVar + " is not set (property '" + property + "')");
            }
        });

        String jwtSecretKey = resolve(environment, JWT_SECRET_KEY_PROPERTY);
        if (jwtSecretKey == null || jwtSecretKey.isBlank()) {
            problems.add("JWT_SECRET_KEY is not set (property '" + JWT_SECRET_KEY_PROPERTY + "')");
        } else {
            try {
                int keyLength = Decoders.BASE64.decode(jwtSecretKey).length;
                if (keyLength < MIN_JWT_SECRET_KEY_BYTES) {
                    problems.add("JWT_SECRET_KEY is too short for HS256: it decodes to " + keyLength
                            + " bytes, at least " + MIN_JWT_SECRET_KEY_BYTES + " bytes are required");
                }
            } catch (DecodingException e) {
                problems.add("JWT_SECRET_KEY is not valid Base64");
            }
        }

        if (!problems.isEmpty()) {
            throw new MissingConfigurationException(problems);
        }
    }

    private static String resolve(ConfigurableEnvironment environment, String property) {
        try {
            return environment.getProperty(property);
        } catch (IllegalArgumentException e) {
            // thrown when the value references an environment variable that is not defined
            return null;
        }
    }

    @Override
    public int getOrder() {
        // run after ConfigDataEnvironmentPostProcessor has loaded application.properties and .env
        return Ordered.LOWEST_PRECEDENCE;
    }
}
