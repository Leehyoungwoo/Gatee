import React, { useRef } from 'react';
import { useMemberStore } from "@store/useMemberStore";

const SignupMemberSetRoleEtc = (props: {
  inputRef: React.RefObject<HTMLInputElement>;
  goToMemberSetCheck: () => void;
  setErrorMessage: (message: string) => void;
}) => {
  const { inputRef, goToMemberSetCheck, setErrorMessage } = props;
  const { gender, role, setRole } = useMemberStore();

  // 입력값
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setRole(value);
    setErrorMessage("");
  }

  return (
    <div className="signup-member-set-role-etc">
      {/*이름 입력*/}
      <div className="signup-member-set-role-etc__input">
        <input
          className="input"
          ref={inputRef}
          type="text"
          pattern="[가-힣]*"
          placeholder={gender === "male" ? "예) 할아버지" : "예) 할머니"}
          value={role?.toString()}
          onChange={handleInputChange}
          autoFocus
        />
      </div>
    </div>
  );
};

export default SignupMemberSetRoleEtc;