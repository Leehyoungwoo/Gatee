import React from 'react';
import { ChatMessage } from "@type/index";
import { MemberInfoSample } from "@constants/index";

const BubbleChatMessage = ({chat}: { chat: ChatMessage }) => {
  // senderType 반환 함수
  const getSenderType = (value: string): string => {
    return value === MemberInfoSample.email ? "my" : "yours";
  };

  return (
    <div className={`bubble-chat__${ getSenderType(chat.sender) }`}>
      { chat.message }
    </div>
  );
};

export default BubbleChatMessage;