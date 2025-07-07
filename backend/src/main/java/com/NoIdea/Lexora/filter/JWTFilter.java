package com.NoIdea.Lexora.filter;


import com.NoIdea.Lexora.model.User.UserEntity;
import com.NoIdea.Lexora.repository.User.UserEntityRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.NoIdea.Lexora.service.Auth.JWTService;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final UserEntityRepository userRepository;

    public JWTFilter(JWTService jwtService, UserEntityRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if(authorization == null){
            filterChain.doFilter(request,response);
            return;
        }
        if (!authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request,response);
            return;
        };
        String jwt_token = authorization.split(" ")[1];

        System.out.println(jwt_token);

        String userEmail = jwtService.getUserName(jwt_token);

        if(userEmail == null) {
            filterChain.doFilter(request,response);
            return;
        };

        UserEntity userData = userRepository.findByEmail(userEmail).orElse(null);

        if (userData==null){
            filterChain.doFilter(request,response);
            return;
        }

        if(SecurityContextHolder.getContext().getAuthentication() !=null){
            filterChain.doFilter(request,response);
            return;
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(userData.getEmail())
                .password(userData.getPassword())
                .build();

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
        token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(token);

        filterChain.doFilter(request,response);
    }
}
