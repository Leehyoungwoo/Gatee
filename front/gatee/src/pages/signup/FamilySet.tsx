import React, { useRef, useState } from 'react';
import { IoIosCamera } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import basicFamily from "@assets/images/signup/basic.svg"

const SignupFamilySet = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedFamilyImage, setSelectedFamilyImage] = useState<string | ArrayBuffer | null>(null);

  // 입력값
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setInputValue(value);
  }

  // 이미지 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFamilyImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // 카메라 버튼 클릭 처리
  const handleCameraButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // 다음 버튼 클릭 처리
  const goToFamilySetCheck = (): void => {
    // // 입력값이 1 ~ 6글자 이하의 한글로만 구성되어 있는지 확인
    // if (inputValue.length < 1 || inputValue.length > 6 || !/^[가-힣]*$/.test(inputValue)) {
    //   alert("1 ~ 6글자 이하의 한글만 입력해주세요.");
    //   // 재포커싱
    //   if (inputRef.current) {
    //     inputRef.current.focus();
    //   }
    //   // 검증 통과시 정보 확인 페이지 이동
    // } else {
      navigate("/signup/family-set/check", {
        state: {
          inputValue,
          selectedFamilyImage
        }
      });
    // }
  }
  console.log(selectedFamilyImage)
  return (
    <div className="signup-family-set">
      {/*제목*/}
      <div className="signup-family-set__title">
        <span className="title__part--01">가족을 소개</span>
        <span className="title__part--02">해 주세요</span>
      </div>
      
      {/*가족 이미지*/}
      <div className="signup-family-set__img-box">
        <img
          className="img-box__img"
          src={selectedFamilyImage ? selectedFamilyImage.toString() : basicFamily}
          alt="family-image"
        />
        <input
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          className="img-box__btn"
          onClick={handleCameraButtonClick}
        >
          <IoIosCamera
            className="btn__icon"
            size={25}
          />
        </button>
      </div>

      {/*가족 이름 입력창*/}
      <div className="signup-family-set__input-box">
        <input
          className="input-box__input"
          ref={inputRef}
          type="text"
          placeholder="예) 길동이네"
          value={inputValue}
          onChange={handleInputChange}
          autoFocus
        />
      </div>

      {/*다음 버튼*/}
      <div className="signup-family-set__btn">
        <button className="btn-next"
          onClick={goToFamilySetCheck}
        >
          <span className="btn-next__text">소개하기</span>
        </button>
      </div>
    </div>
  );
};

export default SignupFamilySet;