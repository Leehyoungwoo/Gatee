import React from "react";
import { ChatMessage, SenderType } from "@type/index";
import { MemberInfoSample } from "@constants/index";
import getUserInfoByEmail from "@helpers/getUserInfoByEmail";
import convertToAMPMTime from "@helpers/convertToAMPMTime";
import renderBubbleComponent from "@helpers/renderBubbleComponent";

const YoursChat = ({ chat, isPrevSender }: { chat: ChatMessage, isPrevSender: boolean}) => {
  const senderInfo = getUserInfoByEmail(chat.sender);

  return (
    <div className="chat__yours-chat">
      {/*프로필*/}
      <div className="chat__yours-chat__profile">
        {!isPrevSender && (
          <img src={senderInfo.image} alt={senderInfo.nickname}/>
        )}
      </div>

      <div className="chat__yours-chat__container">
        {/*닉네임*/}
        {!isPrevSender && (
          <div className="chat__yours-chat__nickname">{ senderInfo.nickname }</div>
        )}

        {/*내용*/}
        {renderBubbleComponent(chat)}
      </div>

      <div className="chat__time-count-wrapper">
        {/*리딩 카운트*/}
        <div className="chat__count">
        {chat.readingCount > 0 && (
          <span>{chat.readingCount}</span>
        )}
        </div>

        {/*시간*/}
        <div className="chat__time">
          { convertToAMPMTime(chat.createdAt) }
        </div>
      </div>

    </div>
  );
};

const MyChat = ({ chat }: { chat: ChatMessage }) => {
  return (
    <div className="chat__my-chat">
      <div className="chat__time-count-wrapper">
        {/*리딩 카운트*/}
        <div className="chat__count--right">
          {chat.readingCount > 0 && (
            <span>{chat.readingCount}</span>
          )}
        </div>

        {/*시간*/}
        <div className="chat__time">
          {convertToAMPMTime(chat.createdAt)}
        </div>
      </div>

      {/*내용*/}
      {renderBubbleComponent(chat)}
    </div>
  );
};

const BubbleChat = ({ chat, isPrevSender }: { chat: ChatMessage, isPrevSender: boolean}) => {
  const myEmail: string = MemberInfoSample.email;

  // senderType 반환 함수
  const getSenderType = (value: string): string => {
    return value === myEmail ? "my" : "yours";
  };

  switch (getSenderType(chat.sender)) {
    case SenderType.YOURS:
      return <YoursChat chat={chat} isPrevSender={isPrevSender}/>;
    case SenderType.MY:
      return <MyChat chat={chat}/>;
    default:
      return null;
  }
};

export default BubbleChat;