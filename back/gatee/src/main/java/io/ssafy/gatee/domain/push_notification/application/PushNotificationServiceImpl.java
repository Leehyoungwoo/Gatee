package io.ssafy.gatee.domain.push_notification.application;

import com.google.firebase.messaging.*;
import io.ssafy.gatee.domain.chatgpt.dto.request.QuestionDto;
import io.ssafy.gatee.domain.chatgpt.dto.response.GptResponseDto;
import io.ssafy.gatee.domain.chatgpt.service.GptService;
import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_notification.dao.MemberNotificationRepository;
import io.ssafy.gatee.domain.push_notification.dto.request.DataFCMReq;
import io.ssafy.gatee.domain.push_notification.dto.request.NaggingReq;
import io.ssafy.gatee.domain.push_notification.dto.request.PushNotificationFCMReq;
import io.ssafy.gatee.domain.push_notification.dto.response.PushNotificationRes;
import io.ssafy.gatee.domain.push_notification.entity.PushNotification;
import io.ssafy.gatee.domain.push_notification.entity.Type;
import io.ssafy.gatee.global.exception.error.not_found.MemberNotFoundException;
import io.ssafy.gatee.global.exception.message.ExceptionMessage;
import io.ssafy.gatee.global.firebase.FirebaseInit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PushNotificationServiceImpl implements PushNotificationService {

    private final FirebaseInit firebaseInit;
    private final GptService gptService;
    private final MemberRepository memberRepository;
    private final MemberNotificationRepository memberNotificationRepository;

    @Override
    public List<PushNotificationRes> readNotifications(UUID memberId) {
        return null;
    }

    @Override
    public void sendTestPush(String token) throws FirebaseMessagingException {
        firebaseInit.init();
        Message message = Message.builder()
                .putData("push", "success")
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle("제목")
                        .setImage("https://source.unsplash.com/random/cat")
                        .setBody("내용")
                        .build())  // 내용 설정
                // 안드로이드 설정
                .setAndroidConfig(AndroidConfig.builder()
                        .setTtl(3600 * 1000)    // 푸시 알림 유지 시간
                        .setNotification(AndroidNotification.builder()
                                .setTitle("제목")
                                .setImage("https://source.unsplash.com/random/cat")
                                .setBody("내용")
                                .setClickAction("push_click").build())  // todo: 푸시 알림 클릭시 연결 동작 - 아마도 프론트 함수 호출?
                        .build())
                // ios 설정
                .setApnsConfig(ApnsConfig.builder()
                        .setAps(Aps.builder()
                                .setCategory("https://source.unsplash.com/random/apple")
                                .setBadge(42)   // todo: ?
                                .build())
                        .build())
                .build();
        String response = FirebaseMessaging.getInstance().send(message);
        log.info("successfully sent message ? " + response);
    }

    @Override
    public String findTokenByMemberId(UUID memberId) {
        return memberRepository.findById(memberId).orElseThrow(()
                -> new MemberNotFoundException(ExceptionMessage.MEMBER_NOT_FOUND)).getNotificationToken();
    }

    @Override
    public boolean checkAgreement(Type type, UUID memberId) {
        Member proxyMember = memberRepository.getReferenceById(memberId);
        return switch (type) {
            case NAGGING -> memberNotificationRepository.findByMember(proxyMember).isNaggingNotification();
            case SCHEDULE -> memberNotificationRepository.findByMember(proxyMember).isScheduleNotification();
            case ALBUM -> memberNotificationRepository.findByMember(proxyMember).isAlbumNotification();
            default -> false;
        };
    }

    @Override
    public void savePushNotification() {

    }

    @Override
    public void savePushNotifications() {

    }

    @Override
    public void sendNagging(NaggingReq naggingReq, UUID memberId) throws FirebaseMessagingException {
        String content = "\"" + naggingReq.message() + "\"라는 문장을 상냥한 어투로 바꿔줘. 이모티콘도 붙여줘.";
        GptResponseDto result = gptService.askQuestion(QuestionDto.builder().content(content).build());
        log.info(result.answer());

        PushNotificationFCMReq pushNotification = PushNotificationFCMReq.builder()
                .receiverId(Collections.singletonList(naggingReq.receiverId()))
                .senderId(memberId)
                .title(Type.NAGGING.toString())
                .content(result.answer())
                .dataFCMReq(DataFCMReq.builder()
                        .type(Type.NAGGING)
                        .typeId(0L)
                        .build())
                .build();
        sendPushOneToOne(pushNotification);
    }

    @Override
    public void sendPushOneToOne(PushNotificationFCMReq pushNotificationFCMReq) throws FirebaseMessagingException {
        // receiver의 권한 여부 확인 - 권한이 없으면 token도 없다
        String receiverToken = findTokenByMemberId(pushNotificationFCMReq.receiverId().get(0));

        // type별 권한 확인
        boolean isAgreed = checkAgreement(pushNotificationFCMReq.dataFCMReq().type(), pushNotificationFCMReq.receiverId().get(0));

        // fcm 요청
        if (Objects.nonNull(receiverToken) && isAgreed) {
            firebaseInit.init();
            Message message = Message.builder()
                    .putData(pushNotificationFCMReq.dataFCMReq().type().toString(),
                            pushNotificationFCMReq.dataFCMReq().typeId().toString())
                    .setToken(receiverToken)
                    .setNotification(Notification.builder()
                            .setTitle(pushNotificationFCMReq.title())
//                            .setImage("https://source.unsplash.com/random/cat")
                            .setBody(pushNotificationFCMReq.content())
                            .build())  // 내용 설정
                    // 안드로이드 설정
                    .setAndroidConfig(AndroidConfig.builder()
                            .setTtl(3600 * 1000)    // 푸시 알림 유지 시간
                            .setNotification(AndroidNotification.builder()
                                    .setTitle(pushNotificationFCMReq.title())
                                    .setImage("https://source.unsplash.com/random/cat")
                                    .setBody(pushNotificationFCMReq.content())
                                    .setClickAction("push_click").build())  // todo: 푸시 알림 클릭시 연결 동작 - 아마도 프론트 함수 호출?
                            .build())
                    // ios 설정
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setCategory("https://source.unsplash.com/random/apple")
                                    .setBadge(42)   // todo: ?
                                    .build())
                            .build())
                    .build();
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("successfully sent message ? " + response);
            // todo : 저장
        }
    }

    @Override
    public void sendPushOneToMany(PushNotificationFCMReq pushNotificationFCMReq) throws FirebaseMessagingException {   // 이건 토큰 할때나..
        firebaseInit.init();
        List<String> receiverTokens = pushNotificationFCMReq.receiverId().stream()
                .map(receiverId -> memberRepository.findById(receiverId))
                .filter(Optional::isPresent)
                .filter(receiver -> checkAgreement(pushNotificationFCMReq.dataFCMReq().type(), receiver.get().getId()))
                .map(receiver -> receiver.get().getNotificationToken()).toList();
        if (!receiverTokens.isEmpty()) {
            MulticastMessage message = MulticastMessage.builder()
                    .addAllTokens(receiverTokens)
                    //                .putData()  // 보여줄 정보 외 데이터 설정
                    .setNotification(Notification.builder()
                            .setTitle(pushNotificationFCMReq.title())
                            //                        .setImage("보내는 사람 프로필 이미지")
                            .setBody(pushNotificationFCMReq.content())
                            .build())  // 내용 설정
                    // 안드로이드 설정
                    .setAndroidConfig(AndroidConfig.builder()
                            .setTtl(3600 * 1000)    // 푸시 알림 유지 시간
                            .setNotification(AndroidNotification.builder()
                                    .setTitle(pushNotificationFCMReq.title())
                                    //                                .setImage("보내는 사람 프로필 이미지")
                                    .setBody(pushNotificationFCMReq.content())
                                    .setClickAction("push_click").build())  // todo: 푸시 알림 클릭시 연결 동작 - 아마도 프론트 함수 호출?
                            .build())
                    // ios 설정
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setCategory("push_click")
                                    .setBadge(42)   // todo: ?
                                    .build())
                            .build())
                    .build();
            BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
            if (response.getFailureCount() > 0) {
                List<SendResponse> responses = response.getResponses();
                List<String> failedTokens = new ArrayList<>();
                for (int i = 0; i < responses.size(); i++) {
                    if (!responses.get(i).isSuccessful()) {
                        // todo: 토큰 오류 시 로직 추가 - db에는 저장해야 한다.
                        failedTokens.add(receiverTokens.get(i));
                    }
                }
            }
            // 저장 로직 success와 fail모두 - 이때는 receiveridlist 활용
            List<PushNotification> notificationList = new ArrayList<>();
            //        pushNotificationRepository.saveAll(notificationList);
            log.info(response.getFailureCount() + " messages were not sent");
            log.info(response.getSuccessCount() + " messages were sent successfully");
        }

    }
}
