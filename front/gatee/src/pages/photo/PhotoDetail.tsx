import React from 'react';
import PhotoItem from "@components/PhotoItem";
import samplePhoto from "@assets/images/schedule/bg_calendar_banner1.jpg";


const PhotoDetail = () => {
  const photoDetailData = {
    liked: ["아빠", "언니"],
    src: samplePhoto
  }
  return (
    <div className="photo-detail">
        <PhotoItem photoDetailData={photoDetailData}/>
    </div>
  );
};



export default PhotoDetail;