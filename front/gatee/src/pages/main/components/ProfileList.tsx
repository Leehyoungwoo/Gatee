import React, {useState} from 'react';
import {Member} from "../../../types/index";
import {FamilyMemberInfoSample} from "../../../constants";
import ProfileModal from "@pages/main/components/ProfileModal";
import {useModalStore} from "@store/useModalStore";
import useModal from "@hooks/useModal";
import {useNavigate} from "react-router-dom";

interface ProfileItemProps  { profileData: Member, handleClickProfile: (profileData: Member) => void }

const ProfileList = ({profileDataList}: { profileDataList: Member[] }) => {
  const {setShowModal} = useModalStore();
  const {isOpen, openModal, closeModal} = useModal();
  const [clickedProfile, setClickedProfile] = useState<Member | null>(null);
  const navigate = useNavigate()

  // 프로필 클릭했을 때
  const handleClickProfile = (profileData:Member) => {
    // 상태 업데이트, 모달 켜주고, 모달 store 업데이트
    setClickedProfile(profileData)
    openModal()
    setShowModal(true)
  }

  // 모달 이벤트
  const handleModalEvent = (type:string,content:string) => {
    // 모달 종료
    setShowModal(false)
    closeModal()
    // 프로필로 가기일 때
    if ( type === "gotoProfile" ) {
      navigate(`/profile/${clickedProfile?.nickname}`)
    } else if (type === "sendMessage") {
      // 메세지 보내기일 때
      console.log(content,"보내기 api")
    }
  }

  return (
    <div className="main-profile-list--container">
      {profileDataList.map((member: Member, index: number) => {
        return <ProfileItem key={index} profileData={member} handleClickProfile={handleClickProfile}/>;
      })}

      {
        isOpen ?
          <ProfileModal profileData={clickedProfile} handleModalEvent={handleModalEvent}/>
          :
          null
      }
    </div>
  );
};

const ProfileItem = ({ profileData, handleClickProfile }:ProfileItemProps) => {
  const handleClickProfileItem = () => {
    handleClickProfile(profileData)
  }

  return (
    <div className="main-profile-list-item--container"
    onClick={handleClickProfileItem}>
      <p>{profileData.nickname}</p>
      <div className="main-profile-wrapper">
        {/*프로필 이미지*/}
        <img className="main-profile-img" src={profileData.image} alt="프사"/>

        {/*기분*/}
        <div className="main-profile-mood">
        {
          profileData?.mood === "HAPPY" ?
            <div>🥰</div>
            :
          profileData?.mood === "SAD" ?
            <div>😥</div>
            :
          profileData?.mood === "ALONE" ?
            <div>😑</div>
            :
          profileData?.mood === "ANGRY" ?
              <div>🤬</div>
            : null
        }
        </div>
      </div>
    </div>
  );
};

export default ProfileList;
