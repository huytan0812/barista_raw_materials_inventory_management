package com.bar_raw_materials.config;

import lombok.Getter;

import java.util.List;

@Getter
public class MissingConfigurationException extends RuntimeException {
    private final List<String> problems;

    public MissingConfigurationException(List<String> problems) {
        super("Invalid configuration: " + String.join("; ", problems));
        this.problems = List.copyOf(problems);
    }
}
