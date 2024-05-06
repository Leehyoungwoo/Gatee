import React, { useRef } from 'react';

const SignupMemberSetRoleEtc = (props: {
  gender: string;
  inputRole: string;
  setInputRole: (inputRole: string) => void;
}) => {
  const inputRef = useRef(null);
  const { gender, inputRole, setInputRole } = props;

  // 입력값
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setInputRole(value);
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
          value={inputRole}
          onChange={handleInputChange}
          autoFocus
        />
      </div>
    </div>
  );
};

export default SignupMemberSetRoleEtc;