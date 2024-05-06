package io.ssafy.gatee.domain.member.api;

import io.ssafy.gatee.domain.member.application.MemberService;
import io.ssafy.gatee.domain.member.dto.request.*;
import io.ssafy.gatee.domain.member.dto.response.MemberInfoRes;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    private final MemberService memberService;

    // 회원 가입
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public UUID register(@RequestBody MemberReq memberReq) {
        return memberService.register(memberReq.name(), memberReq.nickname());
    }

    // 회원 정보 등록 (회원 가입 후 처음)
    @PatchMapping
    @ResponseStatus(HttpStatus.OK)
    public void saveInfo(HttpServletResponse response,
                         @Valid @RequestBody MemberSaveReq memberSaveReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) throws ParseException {
        memberService.saveMemberInfo(memberSaveReq, customUserDetails.getMemberId(), response);
    }

    // 회원 토큰 저장 및 권한 모두 true로 변경
    @PatchMapping("/notifications")
    @ResponseStatus(HttpStatus.OK)
    public void saveNotificationToken(@Valid @RequestBody MemberTokenReq memberTokenReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        memberService.saveNotificationToken(memberTokenReq, customUserDetails.getMemberId());
    }

    // 회원 정보 수정
    @PatchMapping("/profile")
    @ResponseStatus(HttpStatus.OK)
    public void editInfo(@Valid @RequestBody MemberEditReq memberEditReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) throws ParseException {
        log.info(customUserDetails.getUsername());
        log.info(customUserDetails.getPrivilege());
        memberService.editMemberInfo(memberEditReq, customUserDetails.getMemberId());
    }

//     프로필 이미지 수정 - file 추가 예정
//    @PatchMapping("/image")
//    @ResponseStatus(HttpStatus.OK)
//    public void editProfileImage(@Valid @RequestBody String imageUrl) {
//
//    }

    // 기분 상태 수정
    @PatchMapping("/moods")
    @ResponseStatus(HttpStatus.OK)
    public void editMood(@Valid @RequestBody MemberEditMoodReq memberEditMoodReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        memberService.editMood(memberEditMoodReq, customUserDetails.getMemberId());
    }

    // 회원 정보 조회
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public MemberInfoRes readInfo(
            @RequestParam Long familyId, @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {
        return memberService.readMemberInfo(familyId, customUserDetails.getMemberId());
    }
}
