package io.ssafy.gatee.global.security.config;

import io.ssafy.gatee.global.jwt.application.JwtService;
import io.ssafy.gatee.global.jwt.filter.JwtFilter;
import io.ssafy.gatee.global.security.application.AuthService;
import io.ssafy.gatee.global.security.filter.CustomOAuth2LoginFilter;
import io.ssafy.gatee.global.security.handler.CustomAccessDeniedHandler;
import io.ssafy.gatee.global.security.handler.CustomAuthenticationEntryPointHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2FailureHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Log4j2
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final String[] URL_WHITE_LIST = {
            "/api/jwt/**", "/api/auth/**", "/error",
            "/docs/**", "/actuator/**"
    };

    private final JwtService jwtService;
    private final AuthService authService;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
    private final CustomOAuth2FailureHandler customOAuth2FailureHandler;

    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPointHandler customAuthenticationEntryPointHandler;
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .oauth2Login(AbstractHttpConfigurer::disable)
                .cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()))
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests
                        ((auth) -> auth
                                .requestMatchers(URL_WHITE_LIST).permitAll()
                                // 회원가입 후 정보 등록 페이지는 anonymous만 접근 가능, 정보등록을 하지 않은 유저는 다른 페이지에 접근 불가
                                .requestMatchers(HttpMethod.PATCH, "/api/members").hasRole("ANONYMOUS")
                                .requestMatchers(HttpMethod.POST, "/api/family").hasAnyRole("ANONYMOUS", "USER")
                                .anyRequest().hasRole("USER")
                        )

                .exceptionHandling(configurer -> configurer
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPointHandler)
                )

                .addFilterAt(new CustomOAuth2LoginFilter(authService, customOAuth2SuccessHandler, customOAuth2FailureHandler), OAuth2LoginAuthenticationFilter.class)
                .addFilterBefore(new JwtFilter(jwtService), UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
//        config.setAllowedOrigins(List.of(
//                "https://gaty.duckdns.org",
//                "http://localhost:3000",
//                "http://localhost:8080"));
        config.setAllowedOrigins(List.of(
                "*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.addExposedHeader("Authorization");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
