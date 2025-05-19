package com.NoIdea.Lexora.service.Auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;

@Service
public class JWTService {
    private final SecretKey secretKey;

    public JWTService() {
        SecretKey k = null;
        try {
            k = KeyGenerator.getInstance("HmacSHA256").generateKey();
            secretKey = Keys.hmacShaKeyFor(k.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public String getJWTToken(String userEmail, Map<String,Object> claims){
        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*15*4*24))
                .subject(userEmail)
                .signWith(secretKey)
                .compact();
    }

    public String getUserName(String token) {
        Claims data = getTokenData(token);
        if(data ==null) return null;
        return data.getSubject();
    }

    public Object getFieldFromToken(String token,String key){
        Claims data = getTokenData(token);
        if(data ==null) return null;
        return data.get(key);
    }

    private Claims getTokenData(String token) {
        try {
            return Jwts
                    .parser()
                    .verifyWith(secretKey).build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }
}
