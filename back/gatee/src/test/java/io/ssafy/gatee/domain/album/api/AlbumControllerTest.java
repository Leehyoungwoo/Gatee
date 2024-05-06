package io.ssafy.gatee.domain.album.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.config.security.CustomWithMockUser;
import io.ssafy.gatee.domain.album.application.AlbumService;
import io.ssafy.gatee.domain.album.dto.request.AddAlbumPhotoListReq;
import io.ssafy.gatee.domain.album.dto.request.AlbumSaveReq;
import io.ssafy.gatee.domain.album.dto.request.DeleteAlbumPhotoListReq;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@ActiveProfiles({"common, prod"})
@AutoConfigureRestDocs
@WebMvcTest({AlbumController.class, SecurityConfig.class})
@MockBean(JpaMetamodelMappingContext.class)
class AlbumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AlbumService albumService;

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
    private  CustomAuthenticationEntryPointHandler customAuthenticationEntryPointHandler;


    @Test
    @CustomWithMockUser
    @DisplayName("앨범 목록 조회 테스트")
    void readAlbumList() throws Exception {
        mockMvc.perform(get("/api/albums")
                        .param("familyId", "1"))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("월별 목록 조회"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 상세 조회 테스트")
    void readAlbumDetail() throws Exception {
        long albumId = 1L;

        mockMvc.perform(get("/api/albums/" + albumId)
                        .param("familyId", "1"))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 상세 조회"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 생성 테스트")
    void saveAlbum() throws Exception {
        AlbumSaveReq albumSaveReq = AlbumSaveReq.builder()
                .familyId(1L)
                .name("앨범 생성 테스트")
                .build();

        String albumSaveReqJson = objectMapper.writeValueAsString(albumSaveReq);

        mockMvc.perform(post("/api/albums")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(albumSaveReqJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 생성"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 이름 수정 테스트")
    void editAlbumName() throws Exception {
        long albumId = 1L;
        String name = "이름 변경 테스트";

        mockMvc.perform(patch("/api/albums/" + albumId)
                        .param("name", name))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 이름 수정"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 삭제 테스트")
    void deleteAlbum() throws Exception {
        long albumId = 1L;

        mockMvc.perform(delete("/api/albums/" + albumId))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 삭제"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 내 사진 추가 테스트")
    void addAlbumPhotoList() throws Exception {
        long albumId = 1L;

        List<Long> photoIdList = new ArrayList<>();

        photoIdList.add(1L);
        photoIdList.add(2L);
        photoIdList.add(3L);

        AddAlbumPhotoListReq addAlbumPhotoListReq = AddAlbumPhotoListReq.builder()
                .photoIdList(photoIdList)
                .build();

        String addAlbumPhotoListReqJson = objectMapper.writeValueAsString(addAlbumPhotoListReq);

        mockMvc.perform(post("/api/albums/" + albumId + "/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(addAlbumPhotoListReqJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 내 사진 추가"))
                .andExpect(status().isOk());
    }

    @Test
    @CustomWithMockUser
    @DisplayName("앨범 내 사진 삭제 테스트")
    void deleteAlbumPhotoList() throws Exception {
        long albumId = 1L;

        List<Long> photoAlbumId = new ArrayList<>();

        photoAlbumId.add(1L);
        photoAlbumId.add(2L);
        photoAlbumId.add(3L);

        DeleteAlbumPhotoListReq deleteAlbumPhotoListReq = DeleteAlbumPhotoListReq.builder()
                .photoAlbumId(photoAlbumId)
                .build();

        String deleteAlbumPhotoListReqJson = objectMapper.writeValueAsString(deleteAlbumPhotoListReq);

        mockMvc.perform(delete("/api/albums/" + albumId + "/photos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deleteAlbumPhotoListReqJson))
                .andDo(MockMvcResultHandlers.print())
                .andDo(MockMvcRestDocumentation.document("앨범 내 사진 삭제"))
                .andExpect(status().isOk());
    }
}