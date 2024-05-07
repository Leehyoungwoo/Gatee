import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "@store/useMemberStore";

interface HandleFinishTab {
  handleFinishTab: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const FeelingToast = ({handleFinishTab}:HandleFinishTab) => {
  const navigate = useNavigate();
  const { mood, setMood } = useMemberStore();

  // 완료 버튼 누르면 끝내기
  const handleFinish = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFinishTab(event)
  }

  // 기분 설정한 것을 보내기

  return (
    <div className="profile-feeling-toast">
      <div className="feeling-toast__first">
        <button
          className={`first__part--01 ${mood === "HAPPY" ? "active" : ""}`}
          onClick={() => setMood("HAPPY")}
        >
          <span className="part--01--emoji">🥰 </span>
          <span className="part--01--text">
            행복해요
          </span>
        </button>
        <button
          className={`first__part--02 ${mood === "SAD" ? "active" : ""}`}
          onClick={(event) => {
            setMood("SAD");
            handleFinish(event);
          }}
        >
          <span className="part--02--emoji">😥 </span>
          <span className="part--02--text">
            속상해요
          </span>
        </button>
      </div>
      <div className="feeling-toast__second">
        <button
          className={`second__part--01 ${mood === "ANGRY" ? "active" : ""}`}
          onClick={() => setMood("ANGRY")}
        >
          <span className="part--01--emoji">🤬 </span>
          <span className="part--01--text">
            화나요
          </span>
        </button>
        <button
          className={`second__part--02 ${mood === "ALONE" ? "active" : ""}`}
          onClick={() => setMood("ALONE")}
        >
          <span className="part--02--emoji">😑 </span>
          <span className="part--02--text">
            혼자 있고 싶어요
          </span>
        </button>
      </div>
      <div className="feeling-toast__third">
        <button
          className={`third__part--01 ${mood === "FEAR" ? "active" : ""}`}
          onClick={() => setMood("FEAR")}
        >
          <span className="part--01--emoji">😱 </span>
          <span className="part--01--text">
            심란해요
          </span>
        </button>
        <button
          className={`third__part--02 ${mood === "SLEEPY" ? "active" : ""}`}
          onClick={() => setMood("SLEEPY")}
        >
          <span className="part--02--emoji">😪 </span>
          <span className="part--02--text">
            피곤해요
          </span>
        </button>
      </div>
    </div>
  );
};

export default FeelingToast;