package io.ssafy.gatee.domain.push_notification.dao;

import io.ssafy.gatee.domain.push_notification.entity.PushNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PushNotificationRepository extends MongoRepository<PushNotification, Long> {
}
