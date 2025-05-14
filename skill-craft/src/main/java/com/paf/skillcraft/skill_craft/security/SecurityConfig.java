package com.paf.skillcraft.skill_craft.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // ✅ ENABLE CORS globally (important!)
            .and()
            .csrf(csrf -> csrf.disable()) // Disable CSRF for testing (enable in production)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Login & Register → open
                .requestMatchers("/api/auth/oauth2/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/messages/**").permitAll() // ✅ Allow viewing messages
                .requestMatchers(HttpMethod.POST, "/api/messages").authenticated()
                .requestMatchers("/api/messages/**").authenticated()
                .requestMatchers("/api/**").authenticated()   // All other APIs → need JWT
                
            )
            .oauth2Login(oauth2 -> oauth2
            .defaultSuccessUrl("/api/auth/oauth2/success", true) 
        )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
