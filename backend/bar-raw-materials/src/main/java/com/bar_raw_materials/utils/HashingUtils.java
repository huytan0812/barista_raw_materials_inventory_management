package com.bar_raw_materials.utils;

import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class HashingUtils {
    public String hash(String s) {
        String hashed = "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(s.getBytes(StandardCharsets.UTF_8));
            byte[] digest = md.digest();
            BigInteger bi = new BigInteger(1, digest);
            hashed = String.format("%0" + (digest.length << 1) + "X", bi);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return hashed;
    }
}
