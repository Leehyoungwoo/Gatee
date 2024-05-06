package io.ssafy.gatee.domain.push_notification.dao;

import io.ssafy.gatee.domain.push_notification.dto.response.PushNotificationRes;
import org.springframework.stereotype.Repository;

@Repository
public interface PushNotificationCustomRepository {

    // receiver와 page 정보로 notification 조회
    PushNotificationRes readNotifications();
}
