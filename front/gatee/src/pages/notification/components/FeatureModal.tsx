import React, {useState} from 'react';
import {NotificationRes} from "@type/index";
import TextField from "@mui/material/TextField";
import {IoSend} from "react-icons/io5";
import {InputAdornment} from "@mui/material";
import {naggingApi} from "@api/notification";


const FeatureModal = ({notificationData, handleModal}: {
  notificationData: NotificationRes | null | undefined,
  handleModal: () => void // 수정된 부분
}) => {


  return (
    <div className="nagging-modal-bg" onClick={() => handleModal()}>
      <div className="nagging-modal-content--container"
           onClick={(e) => e.stopPropagation()}>
        <div className="feature-modal-top--container">
          <img className="profile-img" src={notificationData?.senderImageUrl} alt=""/>
          <h2 className="nagging-modal-title">{notificationData?.title}</h2>
        </div>
        <p className="nagging-modal-content">{notificationData?.content}</p>
        <button className="close-btn" onClick={() => handleModal()}>닫기</button>
      </div>
    </div>
  )
}

export default FeatureModal;