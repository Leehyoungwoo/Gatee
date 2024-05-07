import {create} from "zustand";
import {persist} from "zustand/middleware";
// 나중에 type 폴더로 빼야될듯
type BirthInfo = {
    birthDay: string | null;
    birthType: string;
};

type MemberStore = {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: (newAccessToken: string) => void;
    setRefreshToken: (newRefreshToken: string) => void;
    memberId: string | null;
    setMemberId: (newMemberId: string) => void;
    name: string;
    setName: (newName: string) => void;
    nickname: string | null;
    setNickName: (newNickname: string) => void;
    birthDay: string | null;
    setBirthDay: (newBirthDay: string) => void;
    birthType: string;
    setBirthType: (newBirthType: string) => void;
    role: string;
    setRole: (newRole: string) => void;
    mood: string;
    setMood: (newMood: string) => void;
    phoneNumber: string;
    setPhoneNumber: (newPhoneNumber: string) => void;
    gender: string;
    setGender: (newGender: string) => void;
    icon: string;
    setIcon: (newIcon: string) => void;
    memberImage: string | ArrayBuffer | null;
    setMemberImage: (newImage: string | ArrayBuffer | null) => void
};

export const useMemberStore = create<MemberStore>()(
    persist((set)=>({
    accessToken: null,
    setAccessToken: (newAccessToken: string) => set({ accessToken: newAccessToken }),
    refreshToken: null,
    setRefreshToken: (newRefreshToken: string) => set({ refreshToken: newRefreshToken }),
    memberId: null,
    setMemberId: (newMemberId: string) => set({ memberId: newMemberId }),
    name: "예빈",
    setName: (newName: string) => set({ name: newName }),
    nickname: null,
    setNickName: (newNickname: string) => set({ nickname: newNickname }),
    birthDay: null,
    setBirthDay: (newBirthDay: string) => set({ birthDay: newBirthDay }),
    birthType: "SOLAR",
    setBirthType: (newBirthType: string) => set({ birthType: newBirthType }),
    role: "",
    setRole: (newRole: string) => set({ role: newRole }),
    mood: "default",
    setMood: (newMood: string) => set({ mood: newMood }),
    phoneNumber: "",
    setPhoneNumber: (newPhoneNumber: string) => set({ phoneNumber: newPhoneNumber }),
    gender: "",
    setGender: (newGender: string) => set({ gender: newGender }),
    icon: "",
    setIcon: (newIcon: string) => set({ icon: newIcon }),
  memberImage: null,
  setMemberImage: (newImage: string | ArrayBuffer | null) => set({memberImage: newImage}),
        }),
        {
            name: "member",

        }
    )
);
