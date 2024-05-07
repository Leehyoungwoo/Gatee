import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import SampleFamily from "@assets/images/signup/sample.svg"
import { useFamilyStore } from "@store/useFamilyStore";
import axios from "axios";

const SignupFamilySetCheck = () => {
  const navigate = useNavigate();
  const { familyName, familyImage } = useFamilyStore();


  const goToFamilySetCheck = () => {
    // 가족 생성하기
    // axios.post
    navigate("/signup/family-set/share");
  }

  const backTo = ():void => {
    navigate(-1);
  }

  return (
    <div className="signup-family-set-check">
      {/*제목*/}
      <div className="signup-family-set-check__title">
        <span className="title__part--01">
          이렇게 소개
        </span>
        <span className="title__part--02">
          할까요?
        </span>
      </div>

      {/*가족 이미지*/}
      <div className="signup-family-set-check__img">
        <img
          className="img"
          src={familyImage?.toString() || SampleFamily}
          alt="family-image"
        />
      </div>

      {/*가족 이름*/}
      <div className="signup-family-set-check__name">
        <span className="name">{familyName}</span>
      </div>

      <div className="signup-family-set-check__btn">
        {/*가족 소개 버튼*/}
        <button
          className="btn-introduce"
          onClick={goToFamilySetCheck}
        >
          <span className="btn-introduce__text">
            소개하기
          </span>
        </button>

        {/*뒤로 가기 버튼*/}
        <button
          className="btn-back"
          onClick={backTo}
        >
          <span className="btn-back__text">
            다시 입력할래요
          </span>
        </button>
      </div>
    </div>
  );
};

export default SignupFamilySetCheck;