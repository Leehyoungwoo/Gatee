import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import {PhotoListProps, PhotoData} from "@type/index";


// 채팅 앨범과 모든 사진의 일별 사진, 월별 연별 앨범 사진 상세페이지에서 활용됨
const PhotoList = ({editMode, photoGroup, handleChecked}: PhotoListProps) => {

  return (
    <div className="photo__item__list-container">
      {/* 사진 묶음 - 3개씩 보여주기 */}
      {photoGroup.map((item: any, index) => {
        return <PhotoItem key={index} photoData={item} editMode={editMode} photoGroup={photoGroup}
                          handleChecked={handleChecked}/>
      })}
    </div>
  )
}

const PhotoItem = ({ photoData, editMode, handleChecked }: PhotoListProps & { photoData: PhotoData }) => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const clickPhotoItem = () => {
    if (editMode === 'normal') {
      navigate("/photo/1");
    } else {
      // 편집 모드에서는 체크박스 변동
      handleCheckBox()
    }
  };

  // 체크박스 변동 함수
  const handleCheckBox = () => {
    if (handleChecked) {
      // 체크박스가 체크 되어있다면 리스트에서 id를 제거하고 체크를 푼다
      if (checked) {
        handleChecked(photoData.id,"delete")
        setChecked(false)
      }
      // 체크박스가 체크 되어있지 않다면, 리스트에 id를 추가하고 체크를 한다
      else {
        handleChecked(photoData.id,"add")
        setChecked(true)
      }
    }
  }

  // 편집 모드가 변경되었을때, 체크를 풀어준다
  useEffect(() => {
    setChecked(false)
  }, [editMode]);
  
  return (
    <div onClick={clickPhotoItem} className="photo__item">
      {editMode !== 'normal' &&
        <Checkbox {...label} className="check-box"
                  checked={checked}
                  onChange={() => handleCheckBox()}
        />}
      <img src={photoData.src} alt={photoData.dateTime} />
    </div>
  );
};

export default PhotoList;