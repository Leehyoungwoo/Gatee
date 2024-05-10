import React from 'react';
import {Link} from "react-router-dom";
import {useFamilyStore} from "@store/useFamilyStore";

// import SamplePhoto from "@assets/images/schedule/calendarBanner1.jpg"

interface YearPhotoItemProps {
  yearPhotoData: {
    dateTime:string,
    src: string
  }
}

const AllYear = () => {
  const {familyId} = useFamilyStore()
  // 월별 대표 사진 샘플 데이터
  const yearPhotoDatas = [
    {dateTime:"2024-01-31T12:00:00", src: "https://i.pinimg.com/736x/3f/53/fe/3f53fec5f0ff0426907978c6abe18c35.jpg"},
    {dateTime:"2023-02-28T12:00:00", src: "https://i.pinimg.com/736x/3f/53/fe/3f53fec5f0ff0426907978c6abe18c35.jpg"},
    {dateTime:"2022-03-31T12:00:00", src: "https://i.pinimg.com/736x/3f/53/fe/3f53fec5f0ff0426907978c6abe18c35.jpg"},
    {dateTime:"2021-04-30T12:00:00", src: "https://i.pinimg.com/736x/3f/53/fe/3f53fec5f0ff0426907978c6abe18c35.jpg"},
    {dateTime:"2020-05-31T12:00:00", src: "https://i.pinimg.com/736x/3f/53/fe/3f53fec5f0ff0426907978c6abe18c35.jpg"},
  ]

  return (
    <div className="year-photo-container">
      {/* 주어진 데이터 정렬로 return */}
      {yearPhotoDatas.map((yearPhotoData, index) => {
        return <YearItem key={index} yearPhotoData={yearPhotoData}/>
      })
      }

    </div>
  );
};

const YearItem = ({yearPhotoData}: YearPhotoItemProps) => {
  const dateString  =  yearPhotoData.dateTime
  const dateTime = new Date(dateString);
  // 현재의 년도 추출
  const year = dateTime.getFullYear();

  return (
    <Link to={`${year}`} className="year-photo-item--container">
      {/* 연 표시 */}
      <div className="year">{year}년</div>
      {/* 배경 사진 */}
      <img className="photo" src={yearPhotoData.src} alt={`${year}`}/>
    </Link>
  )
}

export default AllYear;