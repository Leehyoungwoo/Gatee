import React from 'react';
import { Routes, Route } from "react-router-dom";
import MainLayout from "@layout/MainLayout";
import SubLayout from "@layout/SubLayout";
import ExamIndex from "@pages/exam";
import ExamGrade from "@pages/exam/Grade";
import ExamScored from "@pages/exam/Scored";
import ExamTaking from "@pages/exam/Taking";
import MainIndex from "@pages/main";
import MissionIndex from "@pages/mission";
import NotificationIndex from "@pages/notification";
import OnboardingIndex from "@pages/onboarding/index";
import KaKaoLogin from "@pages/onboarding/components/KaKaoLogin";
import ProfileIndex from "@pages/profile";
import ProfileModify from "@pages/profile/modify";
import ScheduleIndex from "@pages/schedule/index";
import ScheduleCreateSchedule from "@pages/schedule/Create";
import ScheduleCreateReview from "@pages/schedule/CreateReview";
import ScheduleDetail from "@pages/schedule/ScheduleDetail";
import ChatIndex from "@pages/chat";
import ChatPhoto from "@pages/chat/ChatPhoto";
import CharacterIndex from "@pages/character";
import CharacterStart from "@pages/character/AnswerList";
import CharacterQuestion from "@pages/character/Question";
import SignupIndex from "@pages/signup";
import SignupFamilyJoin from "@pages/signup/FamilyJoin";
import SignupFamilyJoinCheck from "@pages/signup/FamilyJoinCheck";
import SignupFamilySet from "@pages/signup/FamilySet";
import SignupFamilySetCheck from "@pages/signup/FamilySetCheck";
import SignupFamilySetShare from "@pages/signup/FamilySetShare";
import SignupMemberSet from "@pages/signup/MemberSet";
import SignupMemberSetBirth from "@pages/signup/MemberSetBirth";
import SignupMemberSetCheck from "@pages/signup/MemberSetCheck";
import SignupMemberSetFinish from "@pages/signup/MemberSetFinish";
import SignupMemberSetPermission from "@pages/signup/MemberSetPermission";
import SignupMemberSetRole from "@pages/signup/MemberSetRole";
import SignupAuth from "@pages/signup/Auth";
import PhotoAlbum from "@pages/photo/AlbumGroup";
import PhotoAllMonthGroupDetail from "@pages/photo/AllMonthGroupDetail";
import PhotoAllYearGroupDetail from "@pages/photo/AllYearGroupDetail";
import AllDay from "@pages/photo/AllDay";
import AllMonth from "@pages/photo/AllMonth";
import AllYear from "@pages/photo/AllYear";
import PhotoIndex from "@pages/photo";
import PhotoDetail from "@pages/photo/PhotoDetail";
import PhotoAlbumGroupDetail from "@pages/photo/AlbumGroupDetail";


const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        {/*모의고사 페이지*/}
        <Route path="/exam" element={<ExamIndex/>}/>
        <Route path="/exam/grade" element={<ExamGrade/>}/>
        <Route path="/exam/scored/:id" element={<ExamScored/>}/>
        <Route path="/exam/taking" element={<ExamTaking/>}/>

        {/*채팅 페이지*/}
        <Route path="/chat" element={<ChatIndex/>}/>
        <Route path="/chat/photo" element={<ChatPhoto/>}/>

        {/*알림 페이지*/}
        <Route path="/notification" element={<NotificationIndex/>}/>

        {/*프로필 페이지*/}
        <Route path="/profile/:name" element={<ProfileIndex/>}/>
        <Route path="/profile/:name/modify" element={<ProfileModify/>}/>

        {/*메인 페이지*/}
        <Route path="/main" element={<MainIndex/>}/>

        {/*미션 페이지*/}
        <Route path="/main/mission" element={<MissionIndex/>}/>

        {/*스케줄 페이지*/}
        <Route path="/schedule" element={<ScheduleIndex/>}/>
        <Route path="/schedule/create-schedule" element={<ScheduleCreateSchedule/>}/>
        <Route path="/schedule/create-review" element={<ScheduleCreateReview/>}/>
        <Route path="/schedule/:id" element={<ScheduleDetail/>}/>

        {/*백과사전 페이지*/}
        <Route path="/character" element={<CharacterIndex/>}/>
        <Route path="/character/start" element={<CharacterStart/>}/>
        <Route path="/character/question" element={<CharacterQuestion/>}/>

        {/*앨범 페이지*/}
        <Route path="/photo" element={<PhotoIndex/>}>
          <Route path="day" element={<AllDay/>}/>
          <Route path="month" element={<AllMonth/>}/>
          <Route path="year" element={<AllYear/>}/>
          <Route path="month/:year/:month" element={<PhotoAllMonthGroupDetail/>}/>
          <Route path="year/:year" element={<PhotoAllYearGroupDetail/>}/>
          <Route path="album" element={<PhotoAlbum/>}/>
          <Route path="album/:id" element={<PhotoAlbumGroupDetail/>}/>
        </Route>
        <Route path="/photo/:id" element={<PhotoDetail/>}/>
      </Route>


      {/*TabBar, BottomBar 없는 레이아웃*/}
      <Route element={<SubLayout/>}>
        {/*온보딩 페이지*/}
        <Route path="/" element={<OnboardingIndex/>}/>
        <Route path="/kakao" element={<KaKaoLogin/>}/>

        {/*회원가입 페이지*/}
        <Route path="/auth" element={<SignupAuth/>}/>
        <Route path="/signup" element={<SignupIndex/>}/>
        <Route path="/signup/family-set" element={<SignupFamilySet/>}/>
        <Route path="/signup/family-set/check" element={<SignupFamilySetCheck/>}/>
        <Route path="/signup/family-set/share" element={<SignupFamilySetShare/>}/>
        <Route path="/signup/family-join" element={<SignupFamilyJoin/>}/>
        <Route path="/signup/family-join/check" element={<SignupFamilyJoinCheck/>}/>
        <Route path="/signup/member-set" element={<SignupMemberSet/>}/>
        <Route path="/signup/member-set/birth" element={<SignupMemberSetBirth/>}/>
        <Route path="/signup/member-set/role" element={<SignupMemberSetRole/>}/>
        <Route path="/signup/member-set/check" element={<SignupMemberSetCheck/>}/>
        <Route path="/signup/member-set/permission" element={<SignupMemberSetPermission/>}/>
        <Route path="/signup/member-set/finish" element={<SignupMemberSetFinish/>}/>
      </Route>

      {/*404 처리*/}
      {/*<Route components={NotFount} />*/}
    </Routes>
  );
}

export default Router;
