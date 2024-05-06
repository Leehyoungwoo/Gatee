package io.ssafy.gatee.domain.push_notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.util.UUID;

@Builder
public record NaggingReq(
        @NotBlank
        UUID receiverId,
        @NotBlank
        String message
) {
}
