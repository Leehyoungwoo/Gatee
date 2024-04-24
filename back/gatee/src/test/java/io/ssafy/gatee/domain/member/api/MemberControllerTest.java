package io.ssafy.gatee.domain.member.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.domain.member.application.MemberService;
import io.ssafy.gatee.domain.member.dto.request.MemberEditMoodReq;
import io.ssafy.gatee.domain.member.dto.request.MemberEditReq;
import io.ssafy.gatee.domain.member.dto.request.MemberSaveReq;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureRestDocs
@WebMvcTest(MemberController.class)
@MockBean(JpaMetamodelMappingContext.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemberService memberService;


    @Test
    @DisplayName("회원 정보 등록 테스트")
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

        mockMvc.perform(patch("/api/members/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(memberEditJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 정보 수정"))
                .andExpect(status().isOk());
    }

    @Test
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
    @DisplayName("회원 정보 조회 테스트")
    void readInfo() throws Exception {
        UUID memberId = UUID.randomUUID();

        mockMvc.perform(get("/api/members")
                        .param("memberId", memberId.toString())
                        .param("familyId", "1"))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("회원 정보 조회"))
                .andExpect(status().isOk());
    }
}