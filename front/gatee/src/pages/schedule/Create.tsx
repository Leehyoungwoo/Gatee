import React, {useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"

import { TextField } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateValidationError } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';

import { FamilyMemberInfoSample } from "@constants/index";
import calculateWeekday from "@helpers/calculateWeekday";
import ProfileImage from '@assets/images/logo/app_icon_orange.png'


const ScheduleCreate = () => {
  dayjs.locale('ko');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState<string>("");
  const [color, setColor] = useState<string>("pink")
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("group")
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>();
  const [endTime, setEndTime] = useState<Dayjs | null>();
  const [participants, setParticipants] = useState<string[]>(FamilyMemberInfoSample.map(member => member.email));
  const [isOpenColor, setIsOpenColor] = useState<boolean>(false)
  const colorList: string[] = ["pink", "yellow", "green", "blue", "purple"]
  const muiFocusCustom = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FFBE5C",
          borderWidth: "2px",
        },
      }
    }
  }
  const [isTitleError, setIsTitleError] = useState<boolean>(false);
  const [isStartDateError, setIsStartDateError] = useState<boolean>(false);
  const [isEndDateError, setIsEndDateError] = useState<boolean>(false);
  const [startDateError, setStartDateError] = useState<DateValidationError | null>(null);
  const [endDateError, setEndDateError] = useState<DateValidationError | null>(null);

  useEffect(() => {
    setStartDate(dayjs(searchParams.get("start")));
    setEndDate(dayjs(searchParams.get("end")));
    setStartTime(dayjs(`${searchParams.get("start")}T00:00:00`));
    setEndTime(dayjs(`${searchParams.get("end")}T23:59:59`));
  }, [searchParams]);

  // 제목 입력 핸들러
  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (!event.target.value) {
      setIsTitleError(true);
    } else {
      setIsTitleError(false);
    }
  }

  // 상세 내용 입력 핸들러
  const handleSetContent = (event: React.ChangeEvent<HTMLInputElement>) => setContent(event.target.value);

  // 카테고리 선택 핸들러
  const handleSetCategory = (newValue: string) => {
    if (newValue !== null)
      setCategory(newValue)
  }

  // 시작 일자 입력 핸들러
  const handleSetStartDate = (newValue: Dayjs | null) => {
    if (dayjs(newValue).isValid()) {
      setStartDate(newValue);
    }
  }

  // 시작 일자 에러 메시지
  const errorMessageStartDate = React.useMemo(() => {
    switch (startDateError) {
      case 'maxDate':
      case 'minDate':
      case 'invalidDate': {
        setIsStartDateError(true);
        return '유효한 날짜를 입력해 주세요';
      }

      default: {
        setIsStartDateError(false);
        return '';
      }
    }
  }, [startDateError]);

  // 종료 일자 입력 핸들러
  const handleSetEndDate = (newValue: Dayjs | null) => {
    if (dayjs(newValue).isValid()) {
      setEndDate(newValue);
    }
  }
  
  // 종료 일자 에러 메시지
  const errorMessageEndDate = React.useMemo(() => {
    switch (endDateError) {
      case 'maxDate':
      case 'invalidDate': {
        setIsEndDateError(true);
        return '유효한 날짜를 입력해 주세요';
      }
      
      case 'minDate': {
        setIsEndDateError(true);
        return '시작일 이후의 날짜를 입력해 주세요';
      }
        
      default: {
        setIsEndDateError(false);
        return '';
      }
    }
  }, [endDateError]);
  
  // 시작 시간 입력 핸들러
  const handleSetStartTime = (newValue: Dayjs | null) => {
    if (dayjs(newValue).isValid()) {
      setStartTime(newValue)
    } else {
      setStartTime(dayjs(`${searchParams.get("start")}T00:00:00`))
    }
  }

  // 종료 시간 입력 핸들러
  const handleSetEndTime = (newValue: Dayjs | null) => {
    if (dayjs(newValue).isValid()) {
      setEndTime(newValue);

      // 종료 시간이 유효하지 않은 경우 기본 값으로 설정
    } else {
      setEndTime(dayjs(`${searchParams.get("end")}T23:59:59`));
    }
  }

  // 종료 시간 유효성 확인
  useEffect(() => {
    // 종료 시간이 시작 시간보다 이전이라면 기본 값으로 설정
    if (dayjs(startDate)?.isSame(dayjs(endDate)) && dayjs(endTime)?.isBefore(dayjs(startTime))) {
      setEndTime(dayjs(`${searchParams.get("end")}T23:59:59`));
    }
  }, [startDate, endDate, startTime, endTime, searchParams]);

  // 색상 코드
  const colorPalette = (value: string): string => {
    if (value === "pink") {
      return "#FFE8E8";
    } else if (value === "yellow") {
      return "#FFED91";
    } else if (value === "green") {
      return "#c2e5c5";
    } else if (value === "blue") {
      return "#b8cdff";
    } else if (value === "purple") {
      return "#d5beff";
    } else {
      return "#FFD08A";
    }
  };

  // 참여자 입력 핸들러
  const handleSetParticipants = (value: string) => {
    if (participants.includes(value)) {
      // 이미 참여자인 경우 참여자 목록에서 제거
      setParticipants(participants.filter((email) => email !== value))
    } else {
      // 아직 참여자가 아닌 경우 참여자 목록에 추가
      setParticipants([...participants, value]);
    }
  }

  // 참여자 프로필 렌더링
  const renderProfile = (email: string, nickname: string, image: string) => {
    return (
      <div className="create-schedule-participant__profile-item" key={email} onClick={() => handleSetParticipants(email)}>
        <div className={`create-schedule-participant__profile-image${participants.includes(email) ? '--active' : ''}`}>
          <img src={ProfileImage} alt=""/>
          {/*<img src={ member.image } alt={ nickname } />*/}
        </div>
        <div className="create-schedule-participant__profile-nickname">
          {nickname}
        </div>
      </div>
    );
  }
  
  const getParticipantNumber = () : string => {
    if (participants.length === FamilyMemberInfoSample.length) {
      return "전원 참여"
    } else {
      return `${participants.length}명 참여`
    }
  }
  
  // 일정 생성 버튼 활성화 여부 계산
  const isButtonEnabled = () => {
    return title && !isStartDateError && !isEndDateError;
  };

  // 일정 생성 버튼 클릭 핸들러
  const handleCreateSchedule = () => {
    if (!title) {
      setIsTitleError(true);
    } else {
      navigate('/schedule');
    }
  }

  return (
    <div className="create-schedule">
      <div className="create-schedule__input-container">
        <div className="create-schedule__title">일정 등록</div>
        {/*일정 설명*/}
        <div className="create-schedule-info">
          <div className="create-schedule__sub-title">설명</div>

          {/*일정 제목 입력*/}
          <div className="create-schedule-info__input-title">
            <TextField
              fullWidth
              value={title}
              onChange={handleSetTitle}
              placeholder="제목* (20자 이내)"
              inputProps={{maxLength: 20}}
              margin="normal"
              sx={muiFocusCustom}
              error={isTitleError}
              helperText={isTitleError ? '제목을 입력해 주세요' : ''}
            />

            {/*일정 색상 선택*/}
            <button
              className={`create-schedule-info__input-color-button${isOpenColor ? '--active' : ''}`}
              onClick={() => {
                setIsOpenColor(!isOpenColor)
              }}
              style={{backgroundColor: colorPalette(color)}}
            >
            </button>
          </div>

          {/*일정 내용 입력*/}
          <div className="create-schedule-info__input-content">
            <TextField
              fullWidth
              value={content}
              onChange={handleSetContent}
              inputProps={{maxLength: 500}}
              placeholder="상세 내용"
              multiline
              minRows={4}
              sx={muiFocusCustom}
            />
          </div>

          {/*일정 카테고리 선택*/}
          <div className="create-schedule-info__input-category">
            <button
              className={`create-schedule-info__input-category-group${category === "group" ? '--active' : ''}`}
              onClick={() => handleSetCategory("group")}
            >가족 일정
            </button>
            <button
              className={`create-schedule-info__input-category-personal${category === "personal" ? '--active' : ''}`}
              onClick={() => handleSetCategory("personal")}
            >개인 일정
            </button>
            <button
              className={`create-schedule-info__input-category-event${category === "event" ? '--active' : ''}`}
              onClick={() => handleSetCategory("event")}
            >이벤트
            </button>
          </div>
        </div>

        {/*일정 기간 선택*/}
        <div className="create-schedule-period">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="create-schedule__sub-title">시작일</div>
            <div className="create-schedule-period__input">
              <DateField
                value={startDate}
                onChange={handleSetStartDate}
                format={`YYYY-MM-DD (${calculateWeekday(startDate)})`}
                onError={(newError) => setStartDateError(newError)}
                slotProps={{
                  textField: {
                    helperText: errorMessageStartDate,
                  },
                }}
                margin="normal"
                sx={muiFocusCustom}
                className="create-schedule-period__date"
              />
              <TimeField
                value={startTime}
                onChange={handleSetStartTime}
                format="HH시 mm분"
                margin="normal"
                sx={muiFocusCustom}
              />
            </div>

            <div className="create-schedule__sub-title">종료일</div>
            <div className="create-schedule-period__input">
              <DateField
                value={endDate}
                onChange={handleSetEndDate}
                format={`YYYY-MM-DD (${calculateWeekday(endDate)})`}
                onError={(newError) => setEndDateError(newError)}
                slotProps={{
                  textField: {
                    helperText: errorMessageEndDate,
                  },
                }}
                minDate={dayjs(startDate)}
                margin="normal"
                sx={muiFocusCustom}
                className="create-schedule-period__date"
              />
              <TimeField
                value={endTime}
                onChange={handleSetEndTime}
                format="HH시 mm분"
                margin="normal"
                sx={muiFocusCustom}
              />
            </div>
          </LocalizationProvider>
        </div>

        {/*참여하는 사람*/}
        {category === "group" && (
          <div className="create-schedule-participant">
            <div className="create-schedule__sub-title">참여자
              <div className="create-schedule-participant__number">
                {getParticipantNumber()}
              </div>
            </div>

            {/*가족 프로필*/}
            <div className="create-schedule-participant__profile">
              {FamilyMemberInfoSample.map((member, index: number) => (
                renderProfile(member.email, member.nickname, member.image)
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="create-schedule__button-create" onClick={handleCreateSchedule}>
        <button
          className="create-schedule__button-create"
          disabled={!isButtonEnabled()}
        >
          생성
        </button>
      </div>

      {/* 색상 선택창 */}
      {isOpenColor && (
        <div className="create-schedule__input-color">
          <div className="create-schedule__input-color-title">색상</div>
          <div className="create-schedule__input-color-list">
            {colorList.map((value: string, index: number) => (
              <button
                key={index}
                className={`create-schedule__input-color-item${value === color ? '--active' : ''}`}
                style={{backgroundColor: colorPalette(value)}}
                onClick={() => setColor(value)}
              />
            ))}
          </div>
          <button
            className="create-schedule__input-color-close"
            onClick={() => setIsOpenColor(false)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

export default ScheduleCreate;