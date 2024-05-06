import React from 'react';
import { ChatMessage } from "@type/index";
import BubbleChatMessage from "@pages/chat/components/BubbleChatMessage";
import BubbleChatFile from "@pages/chat/components/BubbleChatFile";
import BubbleChatAppointment from "@pages/chat/components/BubbleChatAppointment";

// type에 따라 다른 컴포넌트를 반환하는 함수
const renderBubbleComponent = (chat: ChatMessage)  => {
  switch (chat.type) {
    case "message":  // 채팅
      return <BubbleChatMessage key={chat.chatId} chat={chat} />;
    case "file":
      return <BubbleChatFile key={chat.chatId} chat={chat} />;
    case "appointment":  // 약속
      return <BubbleChatAppointment key={chat.chatId} chat={chat} />;
    default:
      return null;
  }
};

export default renderBubbleComponent;