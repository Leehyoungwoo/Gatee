package io.ssafy.gatee.domain.push_notification.dto.request;

import io.ssafy.gatee.domain.push_notification.entity.Type;
import lombok.Builder;

@Builder
public record DataFCMReq(
        Type type,
        Long typeId
) {
}
