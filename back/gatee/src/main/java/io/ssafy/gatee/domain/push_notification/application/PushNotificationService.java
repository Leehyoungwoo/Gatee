package io.ssafy.gatee.domain.push_notification.application;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.push_notification.dto.request.NaggingReq;
import io.ssafy.gatee.domain.push_notification.dto.request.PushNotificationFCMReq;
import io.ssafy.gatee.domain.push_notification.dto.response.PushNotificationRes;
import io.ssafy.gatee.domain.push_notification.entity.Type;

import java.util.List;
import java.util.UUID;

public interface PushNotificationService {

    List<PushNotificationRes> readNotifications(UUID memberId);

    void sendTestPush(String token) throws FirebaseMessagingException;

    String findTokenByMemberId(UUID memberId);

    boolean checkAgreement(Type type, UUID memberId);

    void savePushNotification();

    void savePushNotifications();

    void sendNagging(NaggingReq naggingReq, UUID memberId) throws FirebaseMessagingException;

    void sendPushOneToOne(PushNotificationFCMReq pushNotificationFCMReq) throws FirebaseMessagingException;

    void sendPushOneToMany(String senderToken, List<String> refreshTokenList, Type type, Long typeId) throws FirebaseMessagingException;
}
