import localAxios from "@api/LocalAxios";

const local = localAxios();

// 채팅방 진입 시 내역 조회
export const entryChatRoomApi = async function (success: any, fail: any) {
  // await local.get("/").then(success).catch(fail);
};