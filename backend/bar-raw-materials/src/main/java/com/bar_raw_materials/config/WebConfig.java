package com.bar_raw_materials.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@Configuration
// Config PageImpl serializing to stabilize JSON
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class WebConfig implements WebMvcConfigurer {
    @Value("${image.path}")
    String imagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/image/**").addResourceLocations(
                "file:/" + imagePath
        );
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // add /api prefix for all endpoints from controllers package
        configurer.addPathPrefix(
                "/api",
                controller -> controller.getPackageName()
                        .startsWith("com.bar_raw_materials.controllers")
        );
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedHeaders("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
