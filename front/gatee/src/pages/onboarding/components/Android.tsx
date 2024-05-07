import React from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";

interface HandleFinishTab {
  handleFinishTab: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Android = () => {
  return (
    <div className="android">
      <div className="android-header">
        <div className="android-header__part--01">
          '가티'는 앱에서 더 최적화되어 있습니다!
        </div>
        <span className="android-header__part--02">
          '<BsThreeDotsVertical/> → 가티 열기'
        </span>
        <span className="android-header__part--03">
          로 빠른 앱 실행을 해보세요!
        </span>
      </div>
    </div>
  );
};

export default Android;