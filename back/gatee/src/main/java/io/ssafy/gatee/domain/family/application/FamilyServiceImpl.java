package io.ssafy.gatee.domain.family.application;

import io.ssafy.gatee.domain.family.dao.FamilyRepository;
import io.ssafy.gatee.domain.family.dto.request.FamilyNameReq;
import io.ssafy.gatee.domain.family.dto.request.FamilySaveReq;
import io.ssafy.gatee.domain.family.dto.response.FamilyCodeRes;
import io.ssafy.gatee.domain.family.dto.response.FamilyInfoRes;
import io.ssafy.gatee.domain.family.entity.Family;
import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_family.dao.MemberFamilyRepository;
import io.ssafy.gatee.domain.member_family.dto.response.MemberFamilyInfoRes;
import io.ssafy.gatee.domain.member_family.entity.MemberFamily;
import io.ssafy.gatee.global.exception.error.bad_request.ExpiredCodeException;
import io.ssafy.gatee.global.exception.error.not_found.FamilyNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.MemberFamilyNotFoundException;
import io.ssafy.gatee.global.redis.dao.OnlineRoomMemberRepository;
import io.ssafy.gatee.global.redis.dto.OnlineRoomMember;
import jodd.util.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static io.ssafy.gatee.global.exception.message.ExceptionMessage.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FamilyServiceImpl implements FamilyService {

    private final MemberRepository memberRepository;

    private final FamilyRepository familyRepository;

    private final MemberFamilyRepository memberFamilyRepository;

    private final StringRedisTemplate redisTemplate;

    private final OnlineRoomMemberRepository onlineRoomMemberRepository;

    // 가족 생성
    @Override
    @Transactional
    public void saveFamily(FamilySaveReq familySaveReq, UUID memberId) {
        Member member = Member.builder()
                .id(memberId)
                .build();

        Family family = familyRepository.save(Family.builder()
                .name(familySaveReq.name())
                .score(0)
                .build());

        MemberFamily memberFamily = MemberFamily.builder()
                .member(member)
                .family(family)
                .isLeader(true)
                .build();
        HashSet<UUID> usersSet = new HashSet<>();

        memberFamilyRepository.save(memberFamily);
        onlineRoomMemberRepository.save(OnlineRoomMember.builder()
                .id(family.getId())
                .onlineUsers(usersSet)
                .build());
    }

    // 가족 코드 생성
    @Override
    public FamilyCodeRes createFamilyCode(Long familyId) {
        int leftLimit = 48; // num '0'
        int rightLimit = 122; // alp 'z'
        int targetStringLength = 8;
        Random random = new Random();

        String randomCode = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        ValueOperations<String, String> redisValueOperation = redisTemplate.opsForValue();

        redisValueOperation.set(randomCode, String.valueOf(familyId), 3, TimeUnit.MINUTES);

        return FamilyCodeRes.builder()
                .familyCode(randomCode)
                .build();
    }

    // 가족 합류
    @Override
    @Transactional
    public void joinFamily(String familyCode, UUID memberId) throws ExpiredCodeException {
        ValueOperations<String, String> redisValueOperation = redisTemplate.opsForValue();

        if (StringUtil.isEmpty(redisValueOperation.get(familyCode))) {
            throw new ExpiredCodeException(EXPIRED_CODE);
        } else {
            String familyId = redisValueOperation.get(familyCode);

            Member member = memberRepository.getReferenceById(memberId);

            Family family = familyRepository.getReferenceById(Long.valueOf(familyId));

            MemberFamily memberFamily = MemberFamily.builder()
                    .member(member)
                    .family(family)
                    .role(null)
                    .isLeader(false)
                    .score(0)
                    .build();

            memberFamilyRepository.save(memberFamily);
        }
    }

    // 가족 정보 및 구성원 조회
    @Override
    public FamilyInfoRes readFamily(Long familyId) throws FamilyNotFoundException {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new FamilyNotFoundException(FAMILY_NOT_FOUND));

        List<MemberFamily> memberFamily = memberFamilyRepository.findAllById(familyId)
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        List<MemberFamilyInfoRes> memberFamilyInfoList = memberFamily.stream()
                .map(MemberFamilyInfoRes::toDto).toList();

        return FamilyInfoRes.builder()
                .name(family.getName())
                .familyScore(family.getScore())
                .memberFamilyInfoList(memberFamilyInfoList)
                .build();
    }

    // 가족 이름 수정
    @Override
    @Transactional
    public void editFamilyName(Long familyId, FamilyNameReq familyNameReq) throws FamilyNotFoundException {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new FamilyNotFoundException(FAMILY_NOT_FOUND));

        family.editFamilyName(familyNameReq.name());
    }
}
