import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AiOutlineMan } from "react-icons/ai";
import { AiOutlineWoman } from "react-icons/ai";
import dayjs, { Dayjs } from 'dayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useMemberStore } from "@store/useMemberStore";

const SignupMemberSetBirth = () => {
  const navigate = useNavigate();

  const { birthDay, birthType, gender, setBirthDay, setBirthType, setGender } = useMemberStore();

  const dateFieldCustom = {
    "& .MuiOutlinedInput-root": {
      color: "#000",
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#FFBE5C",
          borderWidth: "2px",
        },
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "secondary.main",
        borderWidth: "3px",
      },
    },
  };

  // 날짜 형식 검증 함수 (YYYY-MM-DD)
  const isValidDateFormat = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  // 날짜 핸들러
  const handleSetSelectedDateChange = (date: Dayjs | null) => {
    setBirthDay(date ? date.format("YYYY-MM-DD") : "");
  };

  // 다음으로 가기
  const goToMemberSetRole = () => {
    navigate("/signup/member-set/role");
  }

  return (
    <div className="signup-member-set-birth">
      {/*생일 제목*/}
      <div className="signup-member-set-birth__title-birth">
        <span className="title-birth__part--01">
          생일
        </span>
        <span className="title-birth__part--02">
          을 입력해 주세요
        </span>
      </div>

      {/*생일 선택*/}
      <div className="signup-member-set-birth__birthday">
        <div className="birthday-date-field">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DateField"]}
            >
              <DateField
                className="birthday-datefield__input"
                format="YYYY / MM / DD"
                autoFocus={true}
                value={birthDay ? dayjs(birthDay) : null}
                onChange={handleSetSelectedDateChange}
                inputProps={{
                  style: {
                    textAlign: "center", fontSize: "23px" },
                }}
                sx={dateFieldCustom}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="birthday-choice">
          <button
            className="birthday-choice__btn-solar"
            onClick={() => setBirthType("SOLAR")}
          >
            <input
              className="btn-solar__input"
              type="radio"
              name="calendarType"
              value="SOLAR"
              checked={birthType === "SOLAR"}
              onChange={(e) => setBirthType(e.target.value)}
            />
            <label
              className={birthType === "SOLAR" ? "btn-solar__input--label--selected" : "btn-solar__input--label"}
            >
              양력
            </label>
          </button>
          <button
            className="birthday-choice__btn-lunar"
            onClick={() => setBirthType("LUNAR")}
          >
            <input
              className="btn-lunar__input"
              type="radio"
              name="calendarType"
              value="lunar"
              checked={birthType === "LUNAR"}
              onChange={(e) => setBirthType(e.target.value)}
            />
            <label
              className={birthType === "LUNAR" ? "btn-lunar__input--label--selected" : "btn-lunar__input--label"}
            >
              음력
            </label>
          </button>
        </div>
      </div>

      {/*성별 제목*/}
      <div className="signup-member-set-birth__title-gender">
        <span className="title-gender__part--01">
          성별
        </span>
        <span className="title-gender__part--02">
          을 골라주세요
        </span>
      </div>

      {/*성별 선택*/}
      <div className="signup-member-set-birth__gender">
        <div className="gender-choice">
          <button
            className={gender === "male" ? "gender-choice__btn-male--selected" : "gender-choice__btn-male"}
            onClick={() => setGender("male")}
          >
            <AiOutlineMan
              className={gender === "male" ? "btn-male--icon--selected" : "btn-male--icon"}
            />
          </button>
          <button
            className={gender === "female" ? "gender-choice__btn-female--selected" : "gender-choice__btn-female"}
            onClick={() => setGender("female")}
          >
            <AiOutlineWoman
              className={gender === "female" ? "btn-female--icon--selected" : "btn-female--icon"}
            />
          </button>
        </div>
      </div>

      {/*다음 버튼*/}
      <div className="signup-member-set-birth__btn">
        <button
          className="btn-next"
          onClick={goToMemberSetRole}
          disabled={!birthDay || !gender || !isValidDateFormat(birthDay)}
        >
            <span className="btn-next__text">
              다음
            </span>
        </button>
      </div>
    </div>
  );
};

export default SignupMemberSetBirth;
