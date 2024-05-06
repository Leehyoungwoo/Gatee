package io.ssafy.gatee.global.websocket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.gatee.global.websocket.application.ChatService;
import io.ssafy.gatee.global.websocket.dto.ChatDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ChatService chatService;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트에서 서버로 보내는 메세지 형식 수신
        log.info(message.getPayload());
        ChatDto chatDto = objectMapper.readValue(message.getPayload(), ChatDto.class);
        log.info(chatDto.toString());

        // FireStore에 저장할 Dto로 파싱
        chatService.sendMessage(chatDto);

        // 메세지 발신 완료
        session.sendMessage(new TextMessage("전송 완료"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("연결 성공");
        // 안읽었던 메세지들 읽기
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("연결 종료");
    }
}