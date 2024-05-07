import React, {useRef, useState} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import SignupMemberSetRoleMale from "@pages/signup/components/MemberSetRoleMale";
import SignupMemberSetRoleFemale from "@pages/signup/components/MemberSetRoleFemale";
import { useMemberStore } from "@store/useMemberStore";

const SignupMemberSetRole = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { role, gender, icon } = useMemberStore();

  const [selectedIcon, setSelectedIcon] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const goToMemberSetCheck = () => {
    // 입력값 검증
    if (role?.length < 1 || role?.length > 6 || !/^[가-힣]*$/.test(role)) {
      // 오류 메시지 설정
      setErrorMessage("한글로 1~6글자를 입력해주세요.");
      // 재포커싱
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return; // 함수 실행 중단
    } else {
      navigate("/signup/member-set/check");
    }
  }

  return (
    <div className="signup-member-set-role">
      {/*역할과 아이콘*/}
      <div className="signup-member-set-role__choice">
        {gender === "male" ? (
          <SignupMemberSetRoleMale
            inputRef={inputRef}
            goToMemberSetCheck={goToMemberSetCheck}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          <SignupMemberSetRoleFemale
            inputRef={inputRef}
            goToMemberSetCheck={goToMemberSetCheck}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      {/*다음 버튼*/}
      <div className="signup-member-set-role__btn">
        <button
          className="btn-next"
          onClick={goToMemberSetCheck}
          disabled={!icon || !role}
        >
            <span className="btn-next__text">
              다음
            </span>
        </button>
      </div>
    </div>
  );
};

export default SignupMemberSetRole;