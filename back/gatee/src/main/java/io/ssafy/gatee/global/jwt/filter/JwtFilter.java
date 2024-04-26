package io.ssafy.gatee.global.jwt.filter;

import io.ssafy.gatee.global.jwt.application.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = jwtService.authenticateJwtToken(request);
        System.out.println("????");
        System.out.println(authentication);
        // 세션에 사용자 등록 - securitycontextholder에 등록한다.
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // 예외 처리 추가
        log.info("토큰 검증 완료");
        log.info(SecurityContextHolder.getContext().toString());
        // 그 다음 필터로 이동
        filterChain.doFilter(request, response);
    }
}