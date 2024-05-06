package io.ssafy.gatee.domain.push_notification.dto.request;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record PushNotificationFCMReq(

        UUID senderId,

        List<UUID> receiverId,

        String title,

        String content,

        DataFCMReq dataFCMReq

) {
}
