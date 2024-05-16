import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';

import {DateSelectArg, DayCellContentArg, EventSourceInput} from '@fullcalendar/core'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

import DayToast from "@pages/schedule/components/DayToast";
import { getAllScheduleApi } from "@api/schedule";
import { useFamilyStore } from "@store/useFamilyStore";
import { ScheduleListRes } from "@type/index";
import getColorCode from "@utils/getColorCode";
import { ScheduleType } from "@type/index";

import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";


const ScheduleIndex = () => {
  const navigate = useNavigate();
  const calendarRef: any = useRef(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isOpenDayToast, setIsOpenDayToast] = useState<boolean>(false);
  const [isShowTodayButton, setIsShowTodayButton] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [selectedEndDate, setSelectedEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const { REACT_APP_GOOGLE_API_KEY, REACT_APP_GOOGLE_CALENDAR_ID } = process.env;
  const { familyId} = useFamilyStore();

  const [scheduleList, setScheduleList] = useState<ScheduleListRes[]>([]);
  const [dayScheduleList, setDayScheduleList] = useState<ScheduleListRes[]>([]);
  const [monthScheduleList, setMonthScheduleList] = useState<EventSourceInput>([]);

  // Fullcalendar 설정
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const calendarDate = calendarApi.getDate();

      // 오늘 날짜 설정
      setCurrentDate(calendarDate);
    }
  }, []);
  
  // 월 업데이트
  useEffect(() => {
    setCurrentMonth(currentDate.getMonth() + 1);
  }, [currentDate]);

  // 일정 데이터 불러오기
  useEffect(() => {
    if (familyId && currentMonth) {
      const data = {
        familyId,
        month: currentMonth,
      };

      getAllScheduleApi(
        data,
        (res) => {
          setScheduleList(res.data);

          // 캘린더 라이브러리에 쓸 수 있도록 변환
          const formattedScheduleList: EventSourceInput = res.data.map((schedule: ScheduleListRes) => ({
            id: schedule.category,
            title: schedule.title,
            color: getColorCode(schedule.emoji),
            content: schedule.content,
            start: dayjs(schedule.startDate).format("YYYY-MM-DD"),
            end: dayjs(schedule.endDate).format("YYYY-MM-DD"),
          }));
          setMonthScheduleList(formattedScheduleList);
        },
        (err) => {
          console.error(err);
        }
      ).then().catch();
    }
  }, [familyId, currentMonth]);

  // today 버튼 렌더링 여부
  useEffect(() => {
    setIsShowTodayButton(currentMonth !== dayjs().month() + 1);
  }, [currentMonth]);

  // 이전 또는 다음 달로 이동하는 클릭 핸들러
  const handleMonthChange = (amount: number) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(calendarApi.getDate().setMonth(calendarApi.getDate().getMonth() + amount));

      // 달력 업데이트
      const updatedDate: Date = calendarApi.getDate();
      const formatUpdateDate: string = dayjs(updatedDate).format("YYYY-MM-DD");
      setCurrentDate(updatedDate);
      setSelectedDate(formatUpdateDate);
    }
  };

  // 오늘 날짜로 이동하는 클릭 핸들러
  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();

      // 달력 업데이트
      const updatedDate = calendarApi.getDate();
      setCurrentDate(updatedDate);
      setIsOpenDayToast(false);
    }
  }

  // 일정 생성 버튼 클릭 핸들러
  const handleCreateScheduleClick = () => {
    // 선택한 영역을 query string으로 전송
    navigate({
        pathname: '/schedule/create',
        search: `?start=${selectedStartDate}&end=${selectedEndDate}`,
    });
  }

  // 일자 클릭 핸들러
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setIsOpenDayToast(true);
  }

  // 일자별 일정 가져오기
  useEffect(() => {
    if (selectedDate) {
      getDaySchedule(selectedDate);
    }
  }, [selectedDate]);

  // 선택한 날짜를 기준으로 해당 날짜의 일정들을 필터링
  const getDaySchedule = (date: string) => {
    const daySchedule: ScheduleListRes[] = scheduleList.filter((schedule: ScheduleListRes) => {
      // 해당 일자에 시작일 또는 종료일이 존재하는 경우 해당 일정을 추출
      const startDate: Dayjs = dayjs(schedule.startDate as string);
      const endDate: Dayjs = dayjs(schedule.endDate as string);
      const targetDate: Dayjs = dayjs(date);

      return targetDate.isSame(startDate, 'day') || targetDate.isSame(endDate, 'day') ||
        (targetDate.isAfter(startDate, 'day') && targetDate.isBefore(endDate, 'day'));
    });
    setDayScheduleList(daySchedule);
  };

  // 영역 선택 핸들러
  const handleSelect = (arg: DateSelectArg) => {
    setSelectedStartDate(arg.startStr);
    setSelectedEndDate(arg.end.toISOString().slice(0, 10));
  }

  // Day cell render hooks
  const useDayCellContent = (arg: DayCellContentArg) => {
    const dayNumber: string = arg.dayNumberText.replace("일", "");   // 일자에서 '일' 제거
    return (
      <div className="schedule-calendar__day" style={{color: arg.isToday ? "white" : ""}}>
        {dayNumber}
        {arg.isToday && <div className="schedule-calendar__today"></div>}
      </div>
    )
  }

  // event content render hooks
  const useEventContent = (arg: { event: any }) => {
    const { event } = arg;
    // 단체 일정은 띠와 함께 색에 맞는 이모티콘 보여 주기
    // 개인 일정은 프로필 보여 주기
    // 이벤트는 숫자에 스티커 붙이기
    if (event.id === ScheduleType.GROUP) {
      return (
        <div>{event.title}</div>
      );
    } else if (event.id === ScheduleType.PERSONAL) {
      return (
        <div>{event.title}</div>
      );
    } else if (event.id === ScheduleType.EVENT) {
      return (
        <div>{event.title}</div>
      );
    }
  };

  // 일자 탭 닫기
  const handleDayClose = () => setIsOpenDayToast(false);

  return (
    <div className="schedule">
      <div className={`schedule-calendar${isOpenDayToast ? '--open' : ''}`}>
        {/*달력 헤더*/}
        <div className="schedule-calendar__header">
          <div className="schedule-calendar__title-wrapper">
            {/*이전 달 전환 버튼*/}
            <button className="schedule-calendar__button-month" onClick={() => handleMonthChange(-1)}>
              <FaCaretLeft size={18}/>
            </button>

            {/*달력 제목*/}
            <div className="schedule-calendar__month">
              {currentDate.getMonth() + 1}월
              <div className="schedule-calendar__year">
                {currentDate.getFullYear()}
              </div>
            </div>

            {/*다음 달 전환 버튼*/}
            <button className="schedule-calendar__button-month" onClick={() => handleMonthChange(1)}>
              <FaCaretRight size={18}/>
            </button>
          </div>
        </div>

        {/*달력*/}
        <div className="schedule-calendar__main">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
            googleCalendarApiKey={REACT_APP_GOOGLE_API_KEY}    // 구글 캘린더 API
            headerToolbar={{left: "", center: "", right: ""}}
            initialView={"dayGridMonth"}
            height={"100%"}               // calendar 높이
            locale={"kr"}                // 언어 한글로 변경
            selectable={true}            // 영역 선택
            // dayMaxEvents={true}          // row 높이보다 많으면 +N more 링크 표시
            moreLinkClick={"disable"}    // more 링크 비활성화

            dayCellContent={useDayCellContent}   // 일자 셀에 요소 추가
            dateClick={handleDateClick}          // 일자 클릭 이벤트
            select={handleSelect}                // 영역 선택 이벤트

            // event
            // eventSources={[
            //   {
            //     googleCalendarId: REACT_APP_GOOGLE_CALENDAR_ID,
            //     className: 'schedule-calendar__holiday',
            //     color: "#ed6363",
            //     textColor: "#FFF",
            //   }
            // ]}

            events={monthScheduleList}
            eventTextColor={"black"}
            eventBorderColor={"white"}
            eventContent={useEventContent}
          />
        </div>
      </div>

      {/*일자별 일정 리스트*/}
      { isOpenDayToast && <DayToast date={selectedDate} schedules={dayScheduleList} onCloseClick={handleDayClose} />}

      { isShowTodayButton && (
        // 오늘 날짜 이동 버튼
        <button className="schedule-calendar__button-today" onClick={handleTodayClick}>
          <span>오늘</span>
        </button>
      )}

      {/*이벤트 추가 버튼*/}
      <button className="schedule-calendar__button-add-event" onClick={handleCreateScheduleClick}>
        <FaPlus size={22} />
      </button>
    </div>
  );
};

export default ScheduleIndex;