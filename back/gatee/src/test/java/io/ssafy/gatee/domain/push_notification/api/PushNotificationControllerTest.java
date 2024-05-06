package io.ssafy.gatee.domain.push_notification.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.config.security.CustomWithMockUser;
import io.ssafy.gatee.domain.push_notification.application.PushNotificationService;
import io.ssafy.gatee.domain.push_notification.dto.request.NaggingReq;
import io.ssafy.gatee.global.jwt.application.JwtService;
import io.ssafy.gatee.global.security.application.AuthService;
import io.ssafy.gatee.global.security.config.SecurityConfig;
import io.ssafy.gatee.global.security.handler.CustomAccessDeniedHandler;
import io.ssafy.gatee.global.security.handler.CustomAuthenticationEntryPointHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2FailureHandler;
import io.ssafy.gatee.global.security.handler.CustomOAuth2SuccessHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles({"common, prod"})
@AutoConfigureRestDocs
@WebMvcTest({PushNotificationController.class, SecurityConfig.class})
@MockBean(JpaMetamodelMappingContext.class)
class PushNotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PushNotificationService pushNotificationService;

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
    @CustomWithMockUser
    @DisplayName("한마디 보내기 테스트")
    void sendNagging() throws Exception {
        NaggingReq naggingReq = NaggingReq.builder()
                .receiverId(UUID.randomUUID())
                .message("방 좀 치워라 쫌!!!")
                .build();

        String memberTokenJson = objectMapper.writeValueAsString(naggingReq);    // objtect to json(string)

        mockMvc.perform(post("/api/notifications/nagging")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberTokenJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("한마디 보내기 및 FCM알림 전송"))
                .andExpect(status().isOk());
    }
}