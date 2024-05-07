package io.ssafy.gatee.global.websocket.application;

import io.ssafy.gatee.global.websocket.dto.ChatDto;

import java.util.UUID;
import java.util.concurrent.ExecutionException;

public interface ChatService {
    void sendMessage(ChatDto chatDto) throws ExecutionException, InterruptedException;

    Long getFamilyIdFromMemberId(UUID memberId);

    void updateRead(UUID memberId, Long familyId);
}
