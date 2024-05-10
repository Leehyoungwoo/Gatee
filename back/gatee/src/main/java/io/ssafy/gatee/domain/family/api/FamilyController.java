package io.ssafy.gatee.domain.family.api;

import io.ssafy.gatee.domain.family.application.FamilyService;
import io.ssafy.gatee.domain.family.dto.request.FamilyIdReq;
import io.ssafy.gatee.domain.family.dto.request.FamilyJoinReq;
import io.ssafy.gatee.domain.family.dto.request.FamilyNameReq;
import io.ssafy.gatee.domain.family.dto.response.FamilyCodeRes;
import io.ssafy.gatee.domain.family.dto.response.FamilyInfoRes;
import io.ssafy.gatee.domain.family.dto.response.FamilySaveRes;
import io.ssafy.gatee.domain.file.application.FileService;
import io.ssafy.gatee.domain.file.dto.FileUrlRes;
import io.ssafy.gatee.domain.file.entity.type.FileType;
import io.ssafy.gatee.global.exception.error.bad_request.ExpiredCodeException;
import io.ssafy.gatee.global.exception.error.not_found.FamilyNotFoundException;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
@Slf4j
public class FamilyController {

    private final FamilyService familyService;
    private final FileService fileService;

    // 가족 생성
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public FamilySaveRes saveFamily(
            @Valid
//            @RequestBody FamilySaveReq familySaveReq,
            @RequestParam("name") String name,
            @RequestParam("fileType") FileType fileType,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) throws IOException {
        FileUrlRes fileUrlRes = fileService.uploadFile(fileType, file);

        return familyService.saveFamily(
                name,
                UUID.fromString(customUserDetails.getUsername()),
                fileUrlRes
        );
    }

    // 가족 코드 생성
    @GetMapping("/code")
    @ResponseStatus(HttpStatus.OK)
    public FamilyCodeRes createFamilyCode(
            @Valid
            @RequestBody FamilyIdReq familyIdReq
    ) {
        return familyService.createFamilyCode(familyIdReq.familyId());
    }

    // 가족 합류
    @PostMapping("/join")
    @ResponseStatus(HttpStatus.OK)
    public void joinFamily(
            @Valid
            @RequestBody FamilyJoinReq familyJoinReq,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) throws ExpiredCodeException {
        familyService.joinFamily(familyJoinReq.familyCode(), customUserDetails.getMemberId());
    }

    // 가족 정보 조회
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public FamilyInfoRes readFamily(
            @Valid
            @RequestParam String familyId
    ) throws FamilyNotFoundException {
        return familyService.readFamily(familyId);
    }

    // 가족 이름 수정
    @PatchMapping("/{familyId}")
    @ResponseStatus(HttpStatus.OK)
    public void editFamilyName(
            @Valid
            @PathVariable("familyId") String familyId,
            @RequestBody FamilyNameReq familyNameReq
    ) throws FamilyNotFoundException {
        log.info(familyId);
        familyService.editFamilyName(UUID.fromString(familyId), familyNameReq);
    }
}
