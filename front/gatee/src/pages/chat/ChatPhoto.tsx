import React from 'react';
import { photoGroup } from "@constants/index";
import PhotoList from "@components/PhotoList";

const ChatPhoto = () => {
  return (
    <div className="chat-photo">
      <div className="chat-photo__title">
        채팅 앨범
      </div>

      {/*사진 리스트*/}
      <PhotoList editMode="normal" photoGroup={photoGroup} handleChecked={null} />
    </div>
  )
}

export default ChatPhoto;