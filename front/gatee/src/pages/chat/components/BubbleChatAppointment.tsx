import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import dayjs from "dayjs";

import MegaphoneIcon from "@assets/images/icons/ic_megaphone.png";
import { MemberInfoSample } from "@constants/index";
import { ChatMessage } from "@type/index";
import getUserInfoByEmail from "@helpers/getUserInfoByEmail";


const BubbleChatAppointment = ({chat}: { chat: ChatMessage }) => {
  const [isUserParticipant, setUserParticipant] = useState<boolean>(false);

  useEffect(() => {
    // 유저 이메일이 참여자 리스트에 있는지 확인
    if (chat.participants) {
      setUserParticipant(chat.participants.includes(MemberInfoSample.email));
    }
  }, [chat.participants]);

  // 참여자 정보 콜백 함수
  const getParticipantsInfo = (email: string, index: number) => {
    const userInfo = getUserInfoByEmail(email);

    return <Avatar src={userInfo.image} alt={userInfo.nickname} key={index}/>;
  }


  return (
    <Card className="bubble-appointment" variant="outlined" sx={{ borderRadius: 3 }}>
      <div className="bubble-appointment__info">
        {/*확성기 아이콘*/}
        <div className="bubble-appointment__icon">
          <img src={ MegaphoneIcon } alt="Megaphone Icon"/>
        </div>

        <div className="bubble-appointment__info-wrapper">
          {/*날짜*/}
          <div className="bubble-appointment__date">
            { dayjs(chat.createdAt).format("M월 D일") }
          </div>

          {/*참여자 리스트*/}
          <AvatarGroup max={4} className="bubble-appointment__participants">
            { chat.participants && chat.participants.map(getParticipantsInfo) }
          </AvatarGroup >
        </div>
      </div>

      {/*내용*/}
      <div className="bubble-appointment__message">
        { chat.message }
      </div>

      {/* 참여자 여부 또는 버튼 렌더링 */}
      {isUserParticipant ? (
        <div className="bubble-appointment__participants-status">
          참여
        </div>
      ) : (
        <div className="bubble-appointment__button">
          <button className="bubble-appointment__button__accept">좋아요</button>
          <button className="bubble-appointment__button__refuse">다음에</button>
        </div>
      )}
    </Card>
  );
};

export default BubbleChatAppointment;