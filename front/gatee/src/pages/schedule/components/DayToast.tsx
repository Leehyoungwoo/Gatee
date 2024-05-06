import React from 'react';
import { ScheduleSample } from "../../../constants"
import { Schedule } from "../../../types";
import DayScheduleCard from "@pages/schedule/components/DayScheduleCard";
import dayjs, { Dayjs } from 'dayjs';
import calculateWeekday from "../../../helpers/calculateWeekday";

interface DayToastProps {
  date: string;
  onCloseClick: () => void;
}

const DayToast = ({date, onCloseClick}: DayToastProps) => {
  const dateTitle = dayjs(date).format("M월 D일");

  return (
    <div className="day-toast">
      <div className="day-toast__header">
        <div className="day-toast__title">{dateTitle} ({calculateWeekday(dayjs(date))})</div>
        <button className="day-toast__close" onClick={onCloseClick}>close</button>
      </div>

      {/*일정 리스트*/}
      <div className="day-toast__schedule-list">
        {/*일정이 없는 경우*/}
        {ScheduleSample.length === 0 &&
          <div className="day-toast__no-event">일정이 없습니다</div>
        }

        {/*일정 리스트*/}
        {ScheduleSample.map((schedule: Schedule, index: number) => (
          <DayScheduleCard key={index} schedule={schedule}/>
        ))}
      </div>
    </div>
  );
}

export default DayToast;