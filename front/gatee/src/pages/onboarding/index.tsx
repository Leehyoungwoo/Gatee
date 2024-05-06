import React, { useState, useEffect } from 'react';
import FirstExam from "@pages/onboarding/components/FirstExam";
import SecondDict from "@pages/onboarding/components/SecondDict";
import ThirdAll from "@pages/onboarding/components/ThirdAll";
import Slider from "react-slick";
import KaKaoLogin from "@pages/onboarding/components/KaKaoLogin";
import * as events from "node:events";
import { isBoolean } from "@craco/craco/dist/lib/utils";
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "@store/useMemberStore";

// 공식 문서 : https://react-slick.neostack.com/docs/api
const OnboardingIndex = () => {
  // const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  // const [activeSlide2, setActiveSlide2] = useState(0);
  const navigate = useNavigate();

  const { accessToken } = useMemberStore();

  // 엑세스 토큰 있을때 보내주는거 주석처리
  // useEffect(() => {
  //   if (accessToken) {
  //     navigate("/main");
  //   }
  // }, []);

  // 기기 파악
  useEffect(() => {
    const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);

    if (isDeviceIOS) {
      alert("가티 서비스는 앱에서 원활한 서비스가 가능합니다. 공유버튼을 눌러, 홈화면에 추가를 눌러주세요.")
    } else {
      alert("갤럭시 최고")
    }
  }, []);

  // 슬라이더 세팅
  var settings
    : {
    dots: boolean,
    infinite: boolean,
    autoplay: boolean,
    autoplaySpeed: number,
    speed: number,
    slidesToShow: number,
    slidesToScroll: number,
    beforeChange: (current: number, next: number) => void,
    // afterChange: (current: number) => void
  }
    = {
    dots: false,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3000,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    // 빠르게 바뀌는데 적용되는 부분
    beforeChange: (current: number, next: number) => {
      // 옛날 슬라이드
      // setOldSlide(current);
      // 활성화된 슬라이드
      setActiveSlide(next);
    },
    // 바뀌고 좀 나중에 적용되는 함수
    // afterChange: (current: number) => {
    //   setActiveSlide2(current)
    // }
  };

  // 상단 인덱스 표시 도트
  const Indicator = () => {
    // 인덱스 수
    const index: number[] = [0, 1, 2, 3]

    return (
      <div className="onboarding__dotContainer">

        {/* 4개의 인덱스를 넘어가면서 현재 인덱스 이전까지 주황표시 */}
        {index.map((item: number,i:number) => {
          if (activeSlide >= item)
            return <div key={i} className="activeDot"></div>
          else
            return <div key={i} className="disableDot"></div>
        })}

      </div>
    )
  }

  return (
    <div className="onboarding__container-center">
      {/* 상단 인덱스 표시 도트 */}
      <Indicator/>

      {/* 슬라이드 */}
      <Slider {...settings}>
        <FirstExam/>
        <SecondDict/>
        <ThirdAll/>
        <KaKaoLogin/>
      </Slider>

    </div>
  );
}


export default OnboardingIndex;