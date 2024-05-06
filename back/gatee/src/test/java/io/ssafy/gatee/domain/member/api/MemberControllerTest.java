package io.ssafy.gatee.domain.member.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.config.security.CustomWithMockUser;
import io.ssafy.gatee.domain.member.application.MemberService;
import io.ssafy.gatee.domain.member.dto.request.MemberEditMoodReq;
import io.ssafy.gatee.domain.member.dto.request.MemberEditReq;
import io.ssafy.gatee.domain.member.dto.request.MemberSaveReq;
import io.ssafy.gatee.domain.member.dto.request.MemberTokenReq;
import io.ssafy.gatee.global.jwt.application.JwtService;
import io.ssafy.gatee.global.security.application.AuthService;
import io.ssafy.gatee.global.security.config.SecurityConfig;
import io.ssafy.gatee.global.security.handler.CustomAccessDeniedHandler;
import io.ssafy.gatee.global.security.handler.CustomAuthenticationEntryPointHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2FailureHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2SuccessHandler;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@ActiveProfiles({"common, prod"})
@AutoConfigureRestDocs
@WebMvcTest({MemberController.class, SecurityConfig.class})
@MockBean(JpaMetamodelMappingContext.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemberService memberService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private AuthService authService;

    @MockBean
    private CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @MockBean
    private CustomOAuth2FailureHandler customOAuth2FailureHandler;

    @MockBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @MockBean
    private CustomAuthenticationEntryPointHandler customAuthenticationEntryPointHandler;

    @Test
    @DisplayName("회원 정보 등록 테스트")
    @CustomWithMockUser(role = "ANONYMOUS")
    void saveInfo() throws Exception {
        MemberSaveReq memberSaveReq = MemberSaveReq.builder()
                .name("name")
                .nickname("nicknamne")
                .birth("2000-01-01")
                .birthType("SOLAR")
                .role("FATHER")
                .familyId("1")
                .build();

        String memberSaveJson = objectMapper.writeValueAsString(memberSaveReq);

        mockMvc.perform(patch("/api/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberSaveJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 정보 등록"))
                .andExpect(status().isOk());

    }


    @Test
    @CustomWithMockUser
    @DisplayName("회원 FCM 토큰 저장 테스트")
    void saveNotificationToken() throws Exception {
        MemberTokenReq memberTokenReq = MemberTokenReq.builder()
                .notificationToken("askdfjasdfshdfjdsa")
                .build();

        String memberTokenJson = objectMapper.writeValueAsString(memberTokenReq);    // objtect to json(string)

        mockMvc.perform(patch("/api/members/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberTokenJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 FCM 토큰 저장"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("회원 정보 수정 테스트")
    void editInfo() throws Exception {
        MemberEditReq memberEditReq = MemberEditReq.builder()
                .name("name")
                .nickname("nickname")
                .birth("2001-01-01")
                .birthType("LUNAR")
                .role("MOTHER")
                .familyId("1")
                .build();

        String memberEditJson = objectMapper.writeValueAsString(memberEditReq);

        log.info("context 확인 : " + String.valueOf(SecurityContextHolder.getContext().getAuthentication()));
        mockMvc.perform(patch("/api/members/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberEditJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 정보 수정"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("기분 상태 수정 테스트")
    void editMood() throws Exception {
        MemberEditMoodReq memberEditMoodReq = MemberEditMoodReq.builder()
                .mood("mood")
                .build();

        String memberEditMoodJson = objectMapper.writeValueAsString(memberEditMoodReq);

        mockMvc.perform(patch("/api/members/moods")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberEditMoodJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("기분 상태 수정"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("회원 정보 조회 테스트")
    void readInfo() throws Exception {
        UUID memberId = UUID.randomUUID();

        mockMvc.perform(get("/api/members")
                        .param("familyId", "1"))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 정보 조회"))
                .andExpect(status().isOk());
    }
}