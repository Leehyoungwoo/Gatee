package io.ssafy.gatee.global.websocket.dto;

import java.util.UUID;

public record ChatDto(
    MessageType messageType,
    String content,
    String sender,
    Long roomId
) {
}
