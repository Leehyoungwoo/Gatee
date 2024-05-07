import React, { useEffect, useRef, useState } from 'react';
import BubbleChat from "@pages/chat/components/BubbleChat";
import ChatInput from "@pages/chat/components/ChatInput";
import ChatDate from "@pages/chat/components/ChatDate";
import { ChatSample } from "@constants/index";
import { ChatMessage } from "@type/index"

// import SockJS from "sockjs-client";


const ChatIndex = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage | null>(null);
  const [newMessageType, setNewMessageType] = useState<string>("");




  useEffect(() => {
    // 컴포넌트 마운트 시 대화 불러오기 & 소켓 연결


    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      console.log("exit chat")
    };
  }, []);

  useEffect(() => {
    console.log(newMessage);
  }, [newMessage]);


  // 이전 채팅과 현재 채팅의 보낸 사람이 같은지 여부에 따라 props 설정
  const setPrevProps = (prevChat: ChatMessage | null, currentChat: ChatMessage) => {
    if (prevChat) {
      return { isPrevSender: prevChat.sender === currentChat.sender };
    }
    return { isPrevSender: false };
  };

  // 채팅 버블 렌더링
  const renderChatBubble = ChatSample.chatList.map((currentChat: ChatMessage, index: number) => {
    const prevChat: ChatMessage | null = index < ChatSample.chatList.length - 1 ? ChatSample.chatList[index + 1] : null;

    return (
      <BubbleChat
        key={currentChat.chatId}
        chat={currentChat}
        {...setPrevProps(prevChat, currentChat)}
      />
    );
  });

  return (
    <div className="chat">
      <div className="chat__main">
        {renderChatBubble}
        <ChatDate date="2024-05-07" />
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatIndex;