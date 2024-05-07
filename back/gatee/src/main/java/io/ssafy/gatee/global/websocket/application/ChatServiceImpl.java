package io.ssafy.gatee.global.websocket.application;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import io.ssafy.gatee.domain.family.dao.FamilyRepository;
import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_family.dao.MemberFamilyRepository;
import io.ssafy.gatee.domain.member_family.entity.MemberFamily;
import io.ssafy.gatee.global.exception.error.not_found.MemberFamilyNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.MemberNotFoundException;
import io.ssafy.gatee.global.redis.dao.OnlineRoomMemberRepository;
import io.ssafy.gatee.global.websocket.dto.ChatDto;
import io.ssafy.gatee.global.websocket.dto.FireStoreChatDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static io.ssafy.gatee.global.exception.message.ExceptionMessage.MEMBER_FAMILY_NOT_FOUND;
import static io.ssafy.gatee.global.exception.message.ExceptionMessage.MEMBER_NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService {

    private final MemberRepository memberRepository;
    private final MemberFamilyRepository memberFamilyRepository;
    private final FamilyRepository familyRepository;
    private final DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference();
    private final OnlineRoomMemberRepository onlineRoomMemberRepository;

    @Override
    public void sendMessage(ChatDto chatDto) throws ExecutionException, InterruptedException {
        // total Member 구하기
        UUID memberId = UUID.fromString(chatDto.sender());
        log.info("memberId: {}", memberId);
        Member member = memberRepository.getReferenceById(memberId);
        List<MemberFamily> memberFamilyList = memberFamilyRepository.findAllWithFamilyByMember(member)
                .orElseThrow(() -> new MemberNotFoundException(MEMBER_NOT_FOUND));
        log.info("memberFamilyList: {}", memberFamilyList);
        // 가족 수 가져오기
        Integer familyCount = memberFamilyList.size();

        // 전체 가족 가져오기
        List<Member> unreadList = memberFamilyList.stream()
                .map(MemberFamily::getMember)
                .toList();
        log.info("unreadList" + unreadList);

        // Redis에서 online 가족 가져오기
        List<Member> onlineMember = onlineRoomMemberRepository.findById(
                        memberFamilyRepository.findByMember(member)
                                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND))
                                .getId())
                .map(onlineRoomMember -> Optional.ofNullable(onlineRoomMember.getOnlineUsers()).orElseGet(Collections::emptySet)) // getOnlineUsers가 null이면 빈 Set을 반환
                .orElseThrow()
                .stream()
                .map(this::findMemberById)
                .toList();
        log.info("onlineMember" + onlineMember);
        // 온라인 멤버를 언리드에서 제거, 오프라인 멤버(안읽은 멤버)만 추가
        List<Member> filteredUnreadList = unreadList.stream()
                .filter(offline -> !onlineMember.contains(offline))
                .toList();
        log.info("filteredUnreadList" + filteredUnreadList);

        List<String> unReadMemberAsStringList = filteredUnreadList.stream()
                .map(pk -> member.getId().toString()) // UUID를 String으로 변환
                .toList();
        log.info("unReadMemberAsStringList" + unReadMemberAsStringList);

        FireStoreChatDto fireStoreChatDto = FireStoreChatDto.builder()
                .messageType(chatDto.messageType())
                .content(chatDto.content())
                .totalMember(familyCount)
                .sender(chatDto.sender())
                .unReadMember(unReadMemberAsStringList)
                .build();
        // 파이어스토어 전송
        saveMessageToRealtimeDatabase(fireStoreChatDto, chatDto.roomId());
    }

    @Override
    public Long getFamilyIdFromMemberId(UUID memberId) {
        Member member = memberRepository.getReferenceById(memberId);
        MemberFamily memberFamily = memberFamilyRepository.findByMember(member)
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));
        return memberFamily.getFamily().getId();
    }

    @Override
    public void updateRead(UUID memberId, Long familyId) {

    }

    public void saveMessageToRealtimeDatabase(FireStoreChatDto fireStoreChatDto, Long roomId) {
        // roomId를 사용하여 채팅방에 대한 참조를 가져옵니다.
        DatabaseReference roomRef = databaseReference.child("chat").child(roomId.toString());

        // 새 메시지를 생성하기 위한 고유 키를 생성합니다.
        String messageId = roomRef.push().getKey();

        // 메시지를 해당 채팅방의 하위 항목으로 저장합니다.
        roomRef.child("messages").child(messageId).setValueAsync(fireStoreChatDto);
    }

    private Member findMemberById(UUID id) {
        return memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(MEMBER_NOT_FOUND));
    }
}
