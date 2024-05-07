import React, {useState} from 'react';
import CustomSwitch from "@components/CustomSwitch";
import {requestPermission} from "../../../firebase-messaging-sw";


interface HandleFinishTab {
  handleFinishTab:(event: React.MouseEvent<HTMLButtonElement>)=>void
}

const SettingsToast = ({handleFinishTab}:HandleFinishTab) => {

  const [albumAlarmChecked, setAlbumAlarmChecked] = useState(false);
  const [naggingAlarmChecked, setNaggingAlarmChecked] = useState(false);
  const [scheduleAlarmChecked, setScheduleAlarmChecked] = useState(false);
  const [anniversaryAlarmChecked, setAnniversaryAlarmChecked] = useState(false);

  // 스위치 조절 함수
  const handleAlbumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumAlarmChecked(event.target.checked);
    requestPermission()
  };
  const handleNaggingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNaggingAlarmChecked(event.target.checked);
  };
  const handleScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleAlarmChecked(event.target.checked);
  };
  const handleAnniversaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnniversaryAlarmChecked(event.target.checked);
  };

  // 완료 버튼 누르면 끝내기
  const handleFinish = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("설정 저장")
    handleFinishTab(event)
  }

  return (

    <div
      className="notification-setting--container">
      {/* 상단 */}
      <div className="setting-top--container">
        <h2 className="setting--title">푸시 알림 설정</h2>
        <button onClick={handleFinish} className="setting-finish-btn">완료</button>
      </div>
      {/* 설정 컨테이너 */}
      <div className="toggle-set-list--container">

        {/* 한줄 토글 */}
        <div className="toggle-set-one-line--container">
          {/* 앨범 토글 */}
          <div className="toggle-item--container">
            <p>
              앨범
            </p>
            <CustomSwitch sx={{m: 1}} checked={albumAlarmChecked}
                          onChange={handleAlbumChange}/>
          </div>

          {/* 한마디 토글 */}
          <div className="toggle-item--container">
            <p>
              한마디
            </p>

            <CustomSwitch sx={{m: 1}} checked={naggingAlarmChecked}
                          onChange={handleNaggingChange}/>

          </div>
        </div>

        {/* 두번째 줄 토글 */}
        <div className="toggle-set-one-line--container">

          {/* 일정 토글 */}
          <div className="toggle-item--container">

            <p>
              일정
            </p>
            <CustomSwitch sx={{m: 1}} checked={scheduleAlarmChecked}
                          onChange={handleScheduleChange}/>
          </div>

          {/* 깜짝 퀴즈 토글 */}
          <div className="toggle-item--container">
            <p>
              기념일
            </p>
            <CustomSwitch sx={{m: 1}} checked={anniversaryAlarmChecked}
                          onChange={handleAnniversaryChange}/>
          </div>

        </div>


      </div>
    </div>
  );
};

export default SettingsToast;
