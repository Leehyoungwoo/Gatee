package io.ssafy.gatee.domain.member.application;

import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.dto.request.MemberEditMoodReq;
import io.ssafy.gatee.domain.member.dto.request.MemberEditReq;
import io.ssafy.gatee.domain.member.dto.request.MemberSaveReq;
import io.ssafy.gatee.domain.member.dto.request.MemberTokenReq;
import io.ssafy.gatee.domain.member.dto.response.MemberInfoRes;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member.entity.Privilege;
import io.ssafy.gatee.domain.member_family.dao.MemberFamilyRepository;
import io.ssafy.gatee.domain.member_family.entity.MemberFamily;
import io.ssafy.gatee.domain.member_notification.dao.MemberNotificationRepository;
import io.ssafy.gatee.domain.member_notification.entity.MemberNotification;
import io.ssafy.gatee.global.exception.error.not_found.MemberFamilyNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.MemberNotFoundException;
import io.ssafy.gatee.global.jwt.application.JwtService;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

import static io.ssafy.gatee.global.exception.message.ExceptionMessage.MEMBER_FAMILY_NOT_FOUND;
import static io.ssafy.gatee.global.exception.message.ExceptionMessage.MEMBER_NOT_FOUND;

@Service
@RequiredArgsConstructor
// 기본적으로 조회 로직이 많기 때문에 전체 read only 선언
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;

    private final MemberFamilyRepository memberFamilyRepository;

    private final MemberNotificationRepository memberNotificationRepository;

    private final JwtService jwtService;

    // 회원 가입
    @Override
    @Transactional
    public UUID register(String name, String nickname) {
        Member member = Member.builder()
                .name(name)
                .nickname(nickname)
                .privilege(Privilege.USER)
                .build();

        memberRepository.save(member);

        return member.getId();
    }

    // 회원 정보 저장
    @Override
    @Transactional  // transaction을 사용하기 위해 선언
    public void saveMemberInfo(MemberSaveReq memberSaveReq, UUID memberId, HttpServletResponse response) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(()-> new MemberNotFoundException(MEMBER_NOT_FOUND));

        member.saveInfo(memberSaveReq);

        MemberFamily memberFamily = memberFamilyRepository.findByMemberAndFamily_Id(member, Long.valueOf(memberSaveReq.familyId()))
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        memberFamily.editRole(memberSaveReq.role());
        
        // 토큰 발급
        modifyMemberToken(member, response);
    }

    @Override
    @Transactional
    public void saveNotificationToken(MemberTokenReq memberTokenReq, UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(()-> new MemberNotFoundException(MEMBER_NOT_FOUND));
        member.saveNotificationToken(memberTokenReq.notificationToken());
        memberNotificationRepository.save(MemberNotification.builder()
                                                            .member(member)
                                                            .build());
    }

    // 회원 정보 수정
    @Override
    @Transactional
    public void editMemberInfo(MemberEditReq memberEditReq, UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException(MEMBER_NOT_FOUND));

        member.editInfo(memberEditReq);

        MemberFamily memberFamily = memberFamilyRepository.findByMemberAndFamily_Id(member, Long.valueOf(memberEditReq.familyId()))
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        memberFamily.editRole(memberEditReq.role());
    }

    // 프로필 이미지 수정
    @Override
    @Transactional
    public void editProfileImage(String imageUrl) {

    }

    // 기분 상태 수정
    @Override
    @Transactional
    public void editMood(MemberEditMoodReq memberEditMoodReq, UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException(MEMBER_NOT_FOUND));

        member.editMood(memberEditMoodReq.mood());
    }

    @Override
    public MemberInfoRes readMemberInfo(Long familyId, UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException(MEMBER_NOT_FOUND));

        MemberFamily memberFamily = memberFamilyRepository.findByMemberAndFamily_Id(member, familyId)
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        return MemberInfoRes.builder()
                .memberId(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .birth(String.valueOf(member.getBirth()))
                .birthType(String.valueOf(member.getBirthType()))
                .mood(member.getMood())
                .role(String.valueOf(memberFamily.getRole()))
                .build();
    }


    @Override
    public void modifyMemberToken(Member member, HttpServletResponse response) {
        Collection<GrantedAuthority> newAuthorities = new ArrayList<>();
        newAuthorities.add(new SimpleGrantedAuthority(Privilege.USER.name()));
        CustomUserDetails customUserDetails = CustomUserDetails.builder()
                .username(member.getId().toString())
                .privilege(member.getPrivilege().toString())
                .authorities(newAuthorities)
                .password(UUID.randomUUID().toString())
                .isAccountNonLocked(true)
                .isEnabled(true)
                .isCredentialsNonExpired(true)
                .isAccountNonExpired(true)
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(customUserDetails, null, newAuthorities);
        jwtService.publishTokens(response, authentication);
    }
}
