import React from "react";
import TopBar from '@components/TopBar';
import BottomBar from "@components/BottomBar";
import { Outlet } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {useModalStore} from "@store/useModalStore";

const MainLayout = () => {
  const {showModal} = useModalStore()
  return (
    <>
      {/* 모달이 띄워진 상태라면 상단바를 회색으로 만듬 */}
      {
        showModal ?
          (
            <HelmetProvider>
            <Helmet>
              <meta name="theme-color" id="theme-color" content="#808080"/>
            </Helmet>
          </HelmetProvider>
          )
          :
          (
            <HelmetProvider>
            <Helmet>
              <meta name="theme-color" id="theme-color" content="#ffffff"/>
            </Helmet>
          </HelmetProvider>
          )
      }

      <TopBar></TopBar>
      <div id="main">
        <Outlet />
      </div>
      <BottomBar></BottomBar>
    </>
  )
}

export default MainLayout