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
// FCM 토큰 요청
// export const updateDeviceToken = async (deviceToken) => {
//   try {
//     await api.post(
//       '/api/notifications/test',
//       {
//         platform: 'Firebase',
//         token: deviceToken,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: accessToken,
//         },
//       },
//     );
//   } catch (error) {
//     console.error(`updateDeviceToken 에러 발생 : ${error}`);
//   }
// };


//const DEVICE_TOKEN = process.env.REACT_APP_API_DEVICE_TOKEN;
// FCM 푸시 알림 요청2 - 각 브라우저별 디바이스 토큰 전송
// export const getPushAlarmByDeviceToken = async (token) => {
//   try {
//     const fcmDeviceToken = localStorage.getItem('fcmDeviceToken');
//     console.log('DEVICE_TOKEN : ' + fcmDeviceToken);
//     const response = await api.post(
//       '/api/v1/fcm-push/random-spot/device-token',
//       {
//         deviceToken: token,
//         delayedSeconds: 0,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: process.env.REACT_APP_API_AUTH_TOKEN,
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`getPushAlarmByLocalStorage 에러 발생 : ${error}`);
//   }
// };

// // FCM 푸시 알림 요청3 - 유저 로그인 정보로 푸시 알림
// export const getPushAlarm = async () => {
//   try {
//     const response = await api.get('/api/v1/fcm-push', {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: process.env.REACT_APP_API_AUTH_TOKEN,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`getPushAlarm 에러 발생 : ${error}`);
//   }
// };