import LocalAxios from "./LocalAxios";
import {AxiosError, AxiosResponse} from "axios";

const local = LocalAxios();

interface MemberAxiosRequest {
  "name": string,
  "nickname": string,
  "birth": string,
  "birthType": string,
  "role": string,
  "familyId": string,
  "phoneNumber": null | string
}

interface CreateFamilyAxiosRequest {
  "name": string,
}

// 가족 생성
export const createFamilyAxios = async function (data: CreateFamilyAxiosRequest,
                                                 success: (res: AxiosResponse<any>) => void,
                                                 fail: (err: AxiosError<any>) => void) {
  await local.post("/family", data).then(success).catch(fail);
};

// 회원 생성
export const createMemberAxios = async function (data: MemberAxiosRequest,
                                                 success: (res: AxiosResponse<any>) => void,
                                                 fail: (err: AxiosError<any>) => void) {
  await local.post("/members", data).then(success).catch(fail);
};
