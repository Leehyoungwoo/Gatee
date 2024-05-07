import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const SignupFamilyJoinCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 가족 조회
  // axios.get

  const goToMemberSet = () => {
    // 가족 합류
    // axios.post
    navigate("/signup/member-set");
  }

  const backTo = () => {
    navigate(-1);
  }

  const familyData = {
    familyId: "33",
    familyImage: "https://cacamaru.com/cacamaru/wp-content/uploads/2019/08/6.%EC%A7%B1%EA%B5%AC%EA%B0%80%EC%A1%B1.jpg",
    familyName: "짱구네 가족"
  }

  return (
    <div className="signup-family-join-check">
      {/*가족 이미지*/}
      <div className="signup-family-join-check__img">
        <img
          className="img"
          src={familyData.familyImage}
          alt="family-image"
        />
      </div>

      {/*가족 이름*/}
      <div className="signup-family-join-check__name">
        <span className="name">{familyData.familyName}</span>
      </div>

      <div className="signup-family-join-check__btn">
        {/*회원 등록 버튼*/}
        <button
          className="btn-join-member"
          onClick={goToMemberSet}
        >
          <span className="btn-join-member__text">
            입장하기
          </span>
        </button>
        <button
          className="btn-back"
          onClick={backTo}
        >
          <span className="btn-back__text">
            우리 가족이 아니에요
          </span>
        </button>
      </div>
    </div>
  );
};

export default SignupFamilyJoinCheck;