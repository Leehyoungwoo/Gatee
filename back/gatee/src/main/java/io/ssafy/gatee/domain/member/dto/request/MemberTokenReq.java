package io.ssafy.gatee.domain.member.dto.request;

import lombok.Builder;

@Builder
public record MemberTokenReq(
        String notificationToken
) {
}
