package io.ssafy.gatee.global.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@AllArgsConstructor
@Getter
@Builder
public final class FireStoreChatDto {
    private final MessageType messageType;
    private final String content;
    private final String sender;
    private final Integer totalMember;
    private final List<String> unReadMember;
}
