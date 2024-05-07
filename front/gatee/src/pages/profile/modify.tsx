import React, { useRef, useState } from 'react';
import { IoIosCamera } from "react-icons/io";
import {useNavigate, useParams} from "react-router-dom";
import { MemberInfoSample } from "@constants/index";
import { FaPhone } from "react-icons/fa";
import axios from "axios";

const ProfileModify = () => {
  const navigate = useNavigate();
  // 쿼리스트링으로 넘어온 이름을 확인하기 위함
  const { name } = useParams<{ name: string }>();
  // 멤버 불러오기
  const member = MemberInfoSample;

  // 이미지 관련
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [memberImage, setMemberImage] = useState<string | ArrayBuffer | null>(member.image);
  // 닉네임 관련
  const inputNicknameRef = useRef<HTMLInputElement>(null);
  const [inputNickname, setInputNickname] = useState<string>(member.nickname);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>("");
  // 이름 관련
  const inputNameRef = useRef<HTMLInputElement>(null);
  const [inputName, setInputName] = useState(member.name);
  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  // 역할 관련
  const roles = ["엄마", "아빠", "아들", "딸", "입력"];
  const inputRoleRef = useRef<HTMLInputElement>(null);
  const [inputRole, setInputRole] = useState<string>(member.role);
  const [customRole, setCustomRole] = useState<string>("");
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);
  const [roleErrorMessage, setRoleErrorMessage] = useState<string>("");
  // 생일 관련
  const inputBirthDayRef = useRef<HTMLInputElement>(null);
  const [inputBirthDay, setInputBirthDay] = useState<string>(member.birth);
  const [birthDayErrorMessage, setBirthDayErrorMessage] = useState<string>("");
  // 캘린더타입
  const [inputBirthType, setInputBirthType] = useState<string>(member.birthType)
  // 전화번호 관련
  const inputPhoneNumberRef = useRef<HTMLInputElement>(null);
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string | null>(member.phoneNumber)
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState<string>("");

  // 수정 버튼
  const goToModified = () => {
    // 회원 정보 수정
    // axios.patch
    navigate(`/profile/${name}`)
  }

  // 날짜 형식 변환 함수
  const changeDate = (originalDate: string): string => {
    const date = new Date(originalDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}.${month}.${day}`;
  }

  // 이미지 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberImage(reader.result);
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

  // 닉네임 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    if (value.length <= 8) {
      setInputNickname(value);
      setNicknameErrorMessage("");
    }
  }

  // 이름 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    if (value.length <= 6) {
      setInputName(value);
      setNameErrorMessage("");
    }
  }
  
  // // 역할 핸들러
  // const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedRole = e.target.value;
  //   // '입력'을 선택한 경우
  //   if (selectedRole === "입력") {
  //     setIsCustomRole(true);
  //     if(customRole) {
  //       setInputRole(customRole);
  //     }
  //   } else {
  //     // '입력'이 아닌 다른 역할을 선택한 경우
  //     setIsCustomRole(false);
  //     setInputRole(selectedRole);
  //   }
  // };
  //
  // // 역할 입력 핸들러
  // const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const customInput = e.target.value;
  //   setCustomRole(customInput);
  //   setInputRole(customInput);
  // };

  // 역할 핸들러
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setInputRole(value);
    setRoleErrorMessage("");
  };


  // 생일 핸들러
  const handleBirthDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setInputBirthDay(value);
    setBirthDayErrorMessage("");
  };

  // 전화번호 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setInputPhoneNumber(value);
    setPhoneNumberErrorMessage("");
  };


  return (
    <div className="profile-modify">
      {/*프로필 섹션*/}
      <div className="profile-modify__profile">
        
        {/*프로필 이미지*/}
        <div className="profile__img-box">
          <img
            className="img-box__img"
            src={memberImage ? memberImage.toString() : member.image}
            alt="profile-image"
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

        {/*닉네임*/}
        <div className="profile__nickname">
          <input
            className="profile__nickname__part--01"
            ref={inputNicknameRef}
            type="text"
            placeholder="닉네임"
            value={inputNickname}
            onChange={handleNicknameChange}
            maxLength={8}
            autoFocus
          />
        </div>

        {/*기분 상태*/}
        <div className="profile__mood-box">
          <span className="mood-box__title">
            오늘 기분이 어때요?
          </span>
          <button
            className="mood-box__btn"
          >
            <span className="mood-box__btn--text">
              {member.mood ? (
                <>
                  {member.mood === "HAPPY" && <div>🥰</div>}
                  {member.mood === "SAD" && <div>😥</div>}
                  {member.mood === "ALONE" && <div>😑</div>}
                  {member.mood === "ANGRY" && <div>🤬</div>}
                  {member.mood === "FEAR" && <div>😱</div>}
                  {member.mood === "SLEEPY" && <div>😪</div>}
                </>
              ) : (
                <div>😶</div>
              )}
            </span>
          </button>
        </div>
        
        {/*정보 박스*/}
        <div className="profile__info-box">
          <div className="info-box__name">
            <div className="name__title">
              <span className="name__title--text">
                이름
              </span>
            </div>
            <div className="name__body">
              <input
                className="name__body--text"
                ref={inputNameRef}
                type="text"
                placeholder="이름"
                value={inputName}
                onChange={handleNameChange}
                maxLength={6}
              />
            </div>
          </div>
          <div className="info-box__role">
            <div className="role__title">
              <span className="role__title--text">
                역할
              </span>
            </div>
            <div className="role__body">
              {/*  <select*/}
              {/*    className="role__body--select"*/}
              {/*    value={isCustomRole ? "입력" : inputRole}*/}
              {/*    onChange={handleRoleChange}*/}
              {/*  >*/}
              {/*    {roles.map((role) => (*/}
              {/*      <option key={role} value={role}>*/}
              {/*        {role}*/}
              {/*      </option>*/}
              {/*    ))}*/}
              {/*  </select>*/}
              {/*  {isCustomRole && (*/}
              {/*    <input*/}
              {/*      type="text"*/}
              {/*      className="role__body--text"*/}
              {/*      placeholder="입력하세요"*/}
              {/*      value={customRole}*/}
              {/*      onChange={handleCustomRoleChange}*/}
              {/*    />*/}
              {/*  )}*/}
              <input
                className="role__body__part--01"
                ref={inputRoleRef}
                type="text"
                placeholder="닉네임"
                value={inputRole}
                onChange={handleRoleChange}
              />
            </div>
          </div>
          <div className="info-box__birth">
            <div className="birth__title">
              <span className="birth__title--text">
                생년월일
              </span>
            </div>
            <div className="birth__body">
              <input
                className="birth__body__part--01"
                ref={inputBirthDayRef}
                type="text"
                placeholder="생년월일"
                value={inputBirthDay}
                onChange={handleBirthDayChange}
              />
              <div className="birthday-choice">
                <button
                  className="birthday-choice__btn-solar"
                  onClick={() => setInputBirthType("SOLAR")}
                >
                  <input
                    className="btn-solar__input"
                    type="radio"
                    name="calendarType"
                    value="SOLAR"
                    checked={inputBirthType === "SOLAR"}
                    onChange={(e) => setInputBirthType(e.target.value)}
                  />
                  <label
                    className={inputBirthType === "SOLAR" ? "btn-solar__input--label--selected" : "btn-solar__input--label"}
                  >
                    양력
                  </label>
                </button>
                <button
                  className="birthday-choice__btn-lunar"
                  onClick={() => setInputBirthType("LUNAR")}
                >
                  <input
                    className="btn-lunar__input"
                    type="radio"
                    name="calendarType"
                    value="lunar"
                    checked={inputBirthType === "LUNAR"}
                    onChange={(e) => setInputBirthType(e.target.value)}
                  />
                  <label
                    className={inputBirthType === "LUNAR" ? "btn-lunar__input--label--selected" : "btn-lunar__input--label"}
                  >
                    음력
                  </label>
                </button>
              </div>
            </div>
          </div>
          <div className="info-box__phone">
            <div className="phone__title">
              <span className="phone__title--text">
                전화번호
              </span>
            </div>
            <div className="phone__body">
              <input
                className="phone__body__part--01"
                ref={inputPhoneNumberRef}
                type="text"
                placeholder="전화번호"
                value={inputPhoneNumber ? inputPhoneNumber : ""}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/*수정 버튼*/}
      <div className="profile-modify__btn">
        <button
          className="btn-modified"
          onClick={goToModified}
        >
          <span className="btn-modified--text">
              수정하기
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProfileModify;