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
import axios from "axios";
import Ios from "@pages/onboarding/components/Ios"
import Android from "@pages/onboarding/components/Android"
import { useModalStore } from "@store/useModalStore";
import Box from "@mui/material/Box";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

// 공식 문서 : https://react-slick.neostack.com/docs/api
const OnboardingIndex = () => {
  // const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  // const [activeSlide2, setActiveSlide2] = useState(0);
  const navigate = useNavigate();

  const { accessToken } = useMemberStore();

  //토큰이 있는 경우
  useEffect(() => {
    if (accessToken) {
      // navigate("/main");
      // 가족 조회
      // axios.get(
      //   `${server}/api/family/1`, null, {
      //     headers: {
      //       Authorization: accessToken
      //     }
      //   }
      // ).then(response => {
            // 가족이 있으면 멤버 조회
            // 가족이 없으면 가족 생성으로 가기
            // axios.get(
            //   `${server}/api/${}`, null, {
            //     headers: {
            //
            //     }
            //   }
            // ).then(response => {
            //   // 멤버도 있으면 main으로 보내기
            //   navigate('/main')
            //   }
            //   // 멤버가 없으면 멤버형성으로 보내기
            //   navigate('/signup/member-set')
            // ).catch(error => {
            //   }
            // )
      //   }
      // ).catch(error => {
      //    // r
      //   }
      // )
    }
  }, []);

  const [deviceType, setDeviceType] = useState('unknown');

  // 기기 파악
  useEffect(() => {
    const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);

    if (isDeviceIOS) {
      setDeviceType('ios');
    } else {
      setDeviceType('android');
    }
  }, []);

  // 모달 상태 적용
  const { setShowModal } = useModalStore();
  // 열린지 닫힌지 상태 확인 가능
  const [state, setState] = useState({
    top: true,
  });

  // MUI 관련 코드 -> 슬라이드 다운 해서 내리기 기능 가능
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        console.log(anchor)
        if (open === true){
          setShowModal(true)
        } else {
          setShowModal(false)
        }
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setState({...state, [anchor]: open});
      };

  // 토스트 객체
  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: 'auto'
      }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, true)}
      style={{backgroundColor:"#7B7B7B"}}
    >
      {/* 토스트 팝업 되는 컴포넌트 넣기 */}
      {deviceType === 'ios' ? (
        <Ios />
      ) : (
        <Android />
      )}
    </Box>
  );

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
      <React.Fragment key={"bottom"}>
        <SwipeableDrawer
          anchor={"top"}
          open={state["top"]}
          onClose={toggleDrawer("top", false)}
          onOpen={toggleDrawer("top", true)}>
          {list("bottom")}
        </SwipeableDrawer>
      </React.Fragment>

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