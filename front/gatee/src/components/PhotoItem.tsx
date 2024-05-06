import React, { useState} from 'react';
import sampleIcon1 from "@assets/images/signup/dad.svg";
import sampleIcon2 from "@assets/images/signup/daughter.svg";
import { IoHeart } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";

interface PhotoDetailData {
  liked: string[];
  src: string;
}

const PhotoItem = ({ photoDetailData }: { photoDetailData: PhotoDetailData }) => {
  const [isPressed, setIsPressed] = useState(false);
  const profileData = [
    {
      nickname: "아빠",
      icon: sampleIcon1
    },
    {
      nickname: "언니",
      icon: sampleIcon2
    },
  ];

  // 좋아요 누르기 함수
  const pressHeart = () => {
    setIsPressed(!isPressed);
  };

  // 사진 다운받기 => 서버 주소로 변경하기
  const downloadPhoto = () => {
    fetch("https://images.pexels.com/photos/1458926/pexels-photo-1458926.jpeg?cs=srgb&dl=pexels-poodles2doodles-1458926.jpg&fm=jpg")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then(blob => {
        const type = blob.type.split("/")[1]; // 이미지의 MIME 타입에서 "image/"를 제거하여 확장자 추출
        const url = window.URL.createObjectURL(new Blob([blob], { type }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `photo.${type}`); // 파일 이름에 이미지 확장자 추가
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error("Error downloading photo:", error));
  };



  return (
    <div className="photo-detail--container">
      {/* 서버 주소로 변경할 것 */}
      <img className="photo-detail-img" src={photoDetailData.src} alt=""/>

      <div className="interaction--container">
        <div className="liked--container">
          {/* 좋아요 표시 */}
          {isPressed ?
            <IoHeart onClick={pressHeart} size={35} color="pink"/>
            :
            <IoHeartOutline onClick={pressHeart} size={35} color="lightgray"/>
          }
          {/* 좋아요 누른 사람 */}
          <div className="liked-profiles--container">
            {profileData.map((item, index) => {
              return <img key={index} className="liked-icon" src={item.icon} alt="" />;
            })}
          </div>
        </div>
        <MdOutlineFileDownload size={30} color="gray" onClick={downloadPhoto} />
      </div>
    </div>
  );
};

export default PhotoItem;
