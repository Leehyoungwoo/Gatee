import React from 'react';
import { ChatMessage, ChatFile } from "@type/index";

const BubbleChatFile = ({chat}: { chat: ChatMessage }) => {
  return (
    <div className={`bubble-file${chat.files && chat.files.length >= 2 ? '--multiple' : '--single'}`}>
      {chat.files && chat.files.map((file: ChatFile, index: number) =>
        <div className="bubble-file__item" key={index}>
          <img src={file.thumbnailUrl} alt={file.S3Id} />
        </div>
      )}
    </div>
  );
};

export default BubbleChatFile;