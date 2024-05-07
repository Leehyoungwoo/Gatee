import localAxios from "@api/LocalAxios";

const local = localAxios()

// 디바이스 토큰 서버로 보내는 함수
export const getPushAlarmByLocalStorage = async () => {
  try {
    const fcmDeviceToken = localStorage.getItem('fcmDeviceToken');
    // 로컬 Axios 적용 코드 주석처리
    local.post(`/notifications/test`, {token: fcmDeviceToken})
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
  } catch (error) {
    console.error(`getPushAlarmByLocalStorage 에러 발생 : ${error}`);
  }
};
