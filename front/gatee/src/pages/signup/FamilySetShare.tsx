import React from 'react';
import { BiCopy } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import SampleFamily from "@assets/images/signup/sample.svg"
import { ReactComponent as KaKaoMessage } from "@assets/images/signup/kakao_message.svg";
import axios from "axios";
import { useFamilyStore } from "@store/useFamilyStore";
import homeIcon from "@assets/images/logo/app_icon_orange.svg"

const SignupFamilySetShare = () => {
  const navigate = useNavigate();
  const web: string = "http://localhost:3000"
  const mobile_home: string = "http://192.168.35.47:3000"
  const mobile_ssafy: string = "http://70.12.247.24:3000"

  // 가족 조회하기
  // axios.get
  // 가족 코드 생성하기
  // axios.get

  const { familyName, familyImage } = useFamilyStore();

  const goToMemberSet = () => {
    navigate("/signup/member-set");
  }
  
  // 카카오 공유하기 버튼
  const kakaoMessage = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${familyName}에서 초대가 왔어요!`,
        description: '초대코드: ABCDEFGH',
        imageUrl:
          'https://img.freepik.com/premium-vector/happy-family-illustration_1124-508.jpg?w=1060',
        link: {
          mobileWebUrl: 'https://gaty.duckdns.org',
          webUrl: 'https://gaty.duckdns.org',
        },
      },
      itemContent: {
        profileText: '가티 - 피는 물보다 진하다',
        profileImageUrl: 'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg', //url로 가져와야할듯
      },
      buttons: [
        {
          title: '앱으로 이동',
          link: {
            mobileWebUrl: 'https://gaty.duckdns.org',
            webUrl: 'https://gaty.duckdns.org',
          },
        },
      ],
    });
  }

  return (
    <div className="signup-family-set-share">
      {/*제목*/}
      <div className="signup-family-set-share__title">
        <span className="title__part--01">가족을 초대</span>
        <span className="title__part--02">해 봐요</span>
      </div>

      {/*가족 이미지*/}
      <div className="signup-family-set-share__img">
        <img
          className="img"
          src={familyImage?.toString() || SampleFamily}
          alt="family-image"
        />
      </div>

      {/*가족 이름*/}
      <div className="signup-family-set-share__name">
        <span className="name">
          {familyName}
        </span>
      </div>

      {/*코드 박스*/}
      <div className="signup-family-set-share__code-box">
        {/*코드 문구*/}
        <span className="code-box__text">
          초대 코드
        </span>
        {/*코드*/}
        <span className="code-box__code">
          A43959FE
        </span>
        {/*복사 버튼*/}
        <div className="code-box__btn">
          <button className="btn-copy">
            <BiCopy
              className="btn-copy__icon"
              size={24}
            />
          </button>
        </div>
      </div>

      {/*카카오톡 공유하기 버튼*/}
      <div className="signup-family-set-share__btn-kakao">
        <button
          className="btn-kakao__btn"
          onClick={kakaoMessage}
        >
          <KaKaoMessage className="btn-kakao__icon" />
        </button>
      </div>

      {/* 다음 버튼 */}
      <div className="signup-family-set-share__btn-next">
        <button
          className="btn-next__btn"
          onClick={goToMemberSet}
        >
          <span className="btn__text">
            다음
          </span>
        </button>
      </div>
    </div>
  );
};

export default SignupFamilySetShare;