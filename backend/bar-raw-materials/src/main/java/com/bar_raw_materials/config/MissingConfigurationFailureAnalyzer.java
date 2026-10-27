package com.bar_raw_materials.config;

import org.springframework.boot.diagnostics.AbstractFailureAnalyzer;
import org.springframework.boot.diagnostics.FailureAnalysis;

// Prints MissingConfigurationException as a readable "APPLICATION FAILED TO START" report.
// Registered in META-INF/spring.factories.
public class MissingConfigurationFailureAnalyzer extends AbstractFailureAnalyzer<MissingConfigurationException> {
    @Override
    protected FailureAnalysis analyze(Throwable rootFailure, MissingConfigurationException cause) {
        String description = "Required configuration is missing or invalid:\n  - "
                + String.join("\n  - ", cause.getProblems());
        String action = "Set the variables in your environment, or copy .env.example to .env "
                + "in the backend working directory and fill in real values.";
        return new FailureAnalysis(description, action, cause);
    }
}
