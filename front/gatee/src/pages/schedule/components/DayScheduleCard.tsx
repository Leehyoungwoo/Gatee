import React from 'react';
import { Schedule } from '../../../types';


export enum ScheduleType {
  GROUP = 'group',
  PERSONAL = 'personal',
  EVENT = 'event'
}

const GroupSchedule = ({ schedule }: { schedule: Schedule }) => {
  return (
    <div className="day-toast__schedule-list-group">
      { schedule.title }
    </div>
  );
};

const PersonalSchedule = ({ schedule }: { schedule: Schedule }) => {
  return (
    <div className="day-toast__schedule-list-personal">
      { schedule.title }
    </div>
  );
};

const Event = ({ schedule }: { schedule: Schedule }) => {
  return (
    <div className="day-toast__schedule-list-event">
      { schedule.title }
    </div>
  );
};

const EventComponent = ({ schedule }: { schedule: Schedule }) => {
  switch (schedule.category) {
    case ScheduleType.GROUP:
      return <GroupSchedule schedule={schedule} />;
    case ScheduleType.PERSONAL:
      return <PersonalSchedule schedule={schedule} />;
    case ScheduleType.EVENT:
      return <Event schedule={schedule} />;
    default:
      return null;
  }
};

export default EventComponent;