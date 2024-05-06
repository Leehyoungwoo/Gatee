import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const SignupFamilyJoin = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState<string>("");

  // 입력값
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.toUpperCase();
    setInputCode(value);
  }

  // 입력하기 버튼 클릭 처리
  const goToFamilyJoinCheck = (): void => {
    // // 입력값이 8글자의 대문자 영어와 숫자로 구성되어 있는지 확인
    // if (inputCode.length !== 8 || !/^[A-Z0-9]*$/.test(inputCode)) { // 조건을 올바르게 수정했습니다.
    //   alert('8글자의 대문자 영어와 숫자만 입력해주세요.');
    //   // 재포커싱
    //   if (inputRef.current) {
    //     inputRef.current.focus();
    //   }
    //   // 검증 통과시 가족 조회
    // } else {
      navigate("/signup/family-join/check", {
        state: {
          inputCode
        }
      });
    // }
  };

  return (
    <div className="signup-family-join">
      {/*제목*/}
      <div className="signup-family-join__title">
        <span className="title__part--01">
          가족코드를 입력
        </span>
        <span className="title__part--02">
            해 주세요
        </span>
      </div>

      {/*코드 입력 박스*/}
      <div className="signup-family-join__input-box">
        <input
          className="input-box__input"
          ref={inputRef}
          type="text"
          pattern="[가-힣]*"
          placeholder="예) A43959FE "
          value={inputCode}
          onChange={handleInputChange}
          autoFocus
        />
      </div>

      {/*입력하기 버튼*/}
      <div className="signup-family-join__btn">
        <button
          className="btn-input"
          onClick={goToFamilyJoinCheck}
        >
            <span className="btn-input__text">
              입력하기
            </span>
        </button>
      </div>
    </div>
  );
};

export default SignupFamilyJoin;