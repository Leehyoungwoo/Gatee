import axios from "axios";


export default function localAxios() {
  // 스토어에 저장되어있는 토큰 가져오기
  const accessToken = localStorage.getItem("accessToken");
  // 인스턴스 생성
  const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
  });

  // 요청을 보낼때의 인터셉터
  // axios 요청의 설정값인 config를 가져옴
  instance.interceptors.request.use(
    async (config) => {
      try {
        console.log("요청 보낼때 인터셉터 입장")
        config.headers["Content-Type"] = "application/json";
        config.headers["Access-Control-Allow-Origin"] = process.env.REACT_APP_API_URL;
        config.headers["Access-Control-Allow-Credentials"] = true;
        console.log(`요청 보낼때 인터셉터의 헤더 ${config.headers}`)
        if (accessToken !== "" && accessToken !== null) {
          console.log("토큰이 있는 경우 헤더를 달아준다", accessToken);
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.log("요청 보낼때 인터셉터 헤더 문제가 발생함")
        console.error("Error while setting authorization header:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // 요청에 대한 응답을 인터셉트 한다.
  // 요청에 대한 응답인 response를 가져온다.
  instance.interceptors.response.use(
    async (response) => {
      console.log("응답이 성공적으로 처리됨")
      return response;
    },
    async (error) => {
      alert(`요청 에러남 ${error}`)
      const code = error.response.data.code
      const errorMsg = error.response.data.message
      console.log(error)
      // 만약 에러의 이유가 토큰의 유효기간이 만료된 것이라면
      if ((code === 401 && errorMsg === "토큰이 만료되었습니다.") || code === 403) {

        try {
          // 리프레시 토큰 요청
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/jwt/rotate-token`,
            null,
            {
              withCredentials: true,
            }
          );
          console.log("리프레시 토큰 res", res)
          // 리프레시 토큰으로 accessToken 갱신
          localStorage.setItem("accessToken", res.headers.accessToken.split(' ')[1]);
          // 원래 요청 재시도
          error.config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
          return axios.request(error.config);
        } catch (refreshError) {
          console.log("리프레시 토큰 만료 ", refreshError)
          // 리프레시 토큰 만료시 카카오 화면으로 보내준다
          // window.location.href = "/kakao"
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
