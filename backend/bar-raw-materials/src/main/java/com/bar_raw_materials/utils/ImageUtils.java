package com.bar_raw_materials.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Component
public class ImageUtils {
    @Value("${image.path}")
    String imagePath;

    public String upload(MultipartFile image, String subPath) {
        String imageName = null;

        try {
            // Create a Path instance to locate the image File into the path later
            Path imageDir = Paths.get(imagePath + subPath);

            // check for valid image file
            if (image.getSize() != 0 && Objects.requireNonNull(image.getContentType()).startsWith("image")) {
                if (!Files.exists(imageDir)) {
                    Files.createDirectories(imageDir);
                }
                // Create a temp file at imageDir
                Path targetLocation = Files.createTempFile(imageDir, "img-", ".jpg");
                try (InputStream fileContent = image.getInputStream()) {
                    Files.copy(fileContent, targetLocation, StandardCopyOption.REPLACE_EXISTING);
                }

                // convert image path to image name
                imageName = targetLocation.getFileName().toString();
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return imageName;
    }
}
