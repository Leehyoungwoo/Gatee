import React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import SettingsToast from "@pages/notification/components/SettingsToast";
import {useModalStore} from "@store/useModalStore";

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface NotificationItemProps {
  type: string,
  content: string,
}

const NotificationIndex = () => {
  // 모달 상태 적용
  const {setShowModal} = useModalStore()

  // 알림 데이터 리스트
  const notificationDataList = [
    {type: "앨범", content: "내용", date: "2024-05"},
    {type: "한마디", content: "내용", date: "2024-05"},
    {type: "일정", content: "내용", date: "2024-05"},
    {type: "깜짝 퀴즈", content: "내용", date: "2024-05"},
    {type: "기념일", content: "내용", date: "2024-05"},
  ]

  // 열린지 닫힌지 상태 확인 가능
  const [state, setState] = React.useState({
    bottom: false,
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

  // 설정 탭에서 완료 버튼 누를 때 팝업 내리기
  const handleFinishTab = (event:React.MouseEvent) => {
    console.log("부모")
    toggleDrawer('bottom', false)(event)
  }

  // 토스트 객체
  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: 'auto'
      }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
      style={{backgroundColor:"#7B7B7B"}}
    >
      {/* 토스트 팝업 되는 컴포넌트 넣기 */}
      <SettingsToast handleFinishTab={handleFinishTab}/>
    </Box>
  );

  

  return (
    <div className="notification-tab--container">

      {/* 상단 */}
      <div className="notification--top--container">
        <h2>알림 목록</h2>

        {/* 토스트 팝업 버튼 */}
        <React.Fragment key={"bottom"}>
          <Button onClick={toggleDrawer("bottom", true)}>
            알림 설정
          </Button>
          <SwipeableDrawer
            anchor={"bottom"}
            open={state["bottom"]}
            onClose={toggleDrawer("bottom", false)}
            onOpen={toggleDrawer("bottom", true)}>
            {list("bottom")}
          </SwipeableDrawer>
        </React.Fragment>

      </div>

      {/* 알림 개별 아이템 */}
      {notificationDataList.map((item, index) => {
        return <NotificationItem key={index} notificationData={item}/>
      })}


    </div>
  );
};

const NotificationItem = ({notificationData}: any) => {

  return (
    <div className="notification-item--container">

      {/* 프로필 아이콘 이미지 */}
      <img className="notification-item-profile--img"
           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHBF8PhK0rOnzOdpAqEH8EI2zcbFeIooAWoRp3WWGP-Q&s"
           alt="다니에루"/>

      {/* 내용 */}
      <div className="notification-item--content">
        <div className="notification-item--top--container">
          <p>앨범</p>
          <p>4월 17일</p>
        </div>
        <p>다니엘님이 사진을 등록했습니다.</p>
      </div>
    </div>
  )
}
export default NotificationIndex;