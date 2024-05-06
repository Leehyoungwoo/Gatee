import React from 'react';
import dayjs from 'dayjs';
import calculateWeekday from "@helpers/calculateWeekday";


const ChatDate = ({ date }: { date: string }) => {
  return (
    <div className="chat__date">
      <div className="chat__date__main">
        { dayjs(date).format("YYYY년 MM월 DD일") } ({calculateWeekday(dayjs(date))})
      </div>
    </div>
  )
};

export default ChatDate;
