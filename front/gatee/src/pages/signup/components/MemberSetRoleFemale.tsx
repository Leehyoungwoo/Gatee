import React from 'react';
import SignupMemberSetRoleEtc from "@pages/signup/components/MemberSetRoleEtc";
import { ReactComponent as Kid } from "@assets/images/signup/daughter.svg";
import { ReactComponent as Young } from "@assets/images/signup/mom.svg";
import { ReactComponent as Old } from "@assets/images/signup/grandma.svg";
import { useMemberStore } from "@store/useMemberStore";

const SignupMemberSetRoleFemale = (props: {
  inputRef: React.RefObject<HTMLInputElement>;
  goToMemberSetCheck: () => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}) => {
  const { inputRef, goToMemberSetCheck, errorMessage, setErrorMessage } = props;
  const { role, setRole, icon, setIcon } = useMemberStore();

  return (
    <div className="signup-member-set-role-female">
      {/*역할 제목*/}
      <div className="signup-member-set-role-female__title-role">
        <span className="title__part--01">
          나의 역할
        </span>
        <span className="title__part--02">
          을 알려주세요
        </span>
      </div>

      {/*역할*/}
      <div className="signup-member-set-role-female__role">
        <button
          className={role === "엄마" ? "btn-mom--selected" : "btn-mom"}
          onClick={() => setRole("엄마")}
        >
          <span className="btn-mom--text">
            엄마
          </span>
        </button>
        <button
          className={role === "딸" ? "btn-daughter--selected" : "btn-daughter"}
          onClick={() => setRole("딸")}
        >
          <span className="btn-daughter--text">
            딸
          </span>
        </button>
        <button
          className={role !== "엄마" && role !== "딸" && role !== null ? "btn-etc--selected" : "btn-etc"}
          onClick={() => setRole("")}
        >
          <span className="btn-etc--text">
            기타
          </span>
        </button>
      </div>

      {/*역할 기타 선택*/}
      <div className="signup-member-set-role-female__role-etc">
        {role !== "엄마" && role !== "딸" && role !== null ? (
          <SignupMemberSetRoleEtc
            inputRef={inputRef}
            goToMemberSetCheck={goToMemberSetCheck}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          null
        )}
      </div>
      <div className="signup-member-set-role-female__error-message">
        {errorMessage ? errorMessage : null}
      </div>

      {/*아이콘 제목*/}
      <div className="signup-member-set-role-female__title-icon">
        <span className="title__part--01">
          아이콘
        </span>
        <span className="title__part--02">
          을 선택해주세요
        </span>
      </div>

      {/*아이콘*/}
      <div className="signup-member-set-role-female__icon">
        <div className="icon-box">
          <button
            className={icon === "kid" ? "icon-box__btn-kid--selected" : "icon-box__btn-kid"}
            onClick={() => setIcon("kid")}
          >
            <Kid
              className={icon === "kid" ? "btn-kid--icon--selected" : "btn-kid--icon"}
            />
          </button>
          <button
            className={icon === "young" ? "icon-box__btn-young--selected" : "icon-box__btn-young"}
            onClick={() => setIcon("young")}
          >
            <Young
              className={icon === "young" ? "btn-young--icon--selected" : "btn-young--icon"}
            />
          </button>
          <button
            className={icon === "old" ? "icon-box__btn-old--selected" : "icon-box__btn-old"}
            onClick={() => setIcon("old")}
          >
            <Old
              className={icon === "old" ? "btn-old--icon--selected" : "btn-old--icon"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupMemberSetRoleFemale;