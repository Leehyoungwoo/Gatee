import React, { useEffect, useRef, useState } from 'react';
import BubbleChat from "@pages/chat/components/BubbleChat";
import ChatInput from "@pages/chat/components/ChatInput";
import ChatDate from "@pages/chat/components/ChatDate";
import { ChatSample } from "@constants/index";
import { ChatMessage } from "@type/index"
import { entryChatRoomApi } from "@api/Chat";

import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";


const ChatIndex = () => {
  const REACT_APP_API_URL: string | undefined = process.env.REACT_APP_API_URL
  const client = useRef<CompatClient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage | null>(null);
  const [newMessageType, setNewMessageType] = useState<string>("");

  // 채팅방 최초 진입 시 이전 채팅 불러오기
  const loadChatHistory = () => {
    entryChatRoomApi(
      ({data}: any) => setMessages(data),
      (error: any) => {
        console.log(error);
      }
    ).then(() => {
      //
    });
  }

  // connect
  const connectHandler = () => {
    // SockJs 클라이언트 객체 생성
    const socket: WebSocket = new SockJS(`${REACT_APP_API_URL}/ws`); // end point 확인 후 수정

    // SockJs 클라이언트 객체를 Stomp 프로포콜로 오버랩
    client.current = Stomp.over(socket);

    // 클라이언트 객체를 서버와 연결
    client.current.connect(
      {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json',
      },
      () => {
        console.log("Connected to WebSocket");

        // 연결 성공 시 Subscribe
        onConnected();

      }, () => {
        console.log("Could not WebSocket server")
      }
    );
  }

  // subscribe
  const onConnected = () => {
    // 서버로부터 새로운 메시지 수신
    client.current?.subscribe(
      ``,   // end point 확인 후 수정
      (data: any) => {
      const type = JSON.parse(data.body).type;
      const response = JSON.parse(data.body).result;

      // 메시지 타입 확인
      // MESSAGE, FILE, APPOINTMENT, TIMESTAMP
      if (type === "MESSAGE") {
        console.log("Received MESSAGE: ", response);
      }

      else if (type === "FILE") {
        console.log("Received FILE: ", response);
      }

      else if (type === "APPOINTMENT") {
        console.log("Received APPOINTMENT: ", response);
      }

      else if (type === "TIMESTAMP") {
        console.log("Received TIMESTAMP: ", response);
      }
    })
  }

  useEffect(() => {
    // 컴포넌트 마운트 시 대화 불러오기 & 소켓 연결
    loadChatHistory();
    connectHandler();

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      if (client.current) {
        client.current.disconnect();
        console.log('Disconnected from WebSocket');
      }
    };
  }, []);

  // send
  const sendHandler = (message: ChatMessage, type: string) => {
    // 연결 확인
    if (client.current && client.current.connected) {
      client.current.send(
        ``,   // end point 확인 후 수정
        {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
        // json 형식으로 전송
        JSON.stringify({
          type: type,
          message: message,  // 백에서 원하는 형식으로 수정
        }),
      )
    }
  }

  useEffect(() => {
    if (newMessage) {
      sendHandler(newMessage, newMessageType);
    }
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