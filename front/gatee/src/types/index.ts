/* 응답타입: Res, 요청타입: Req, props타입: Props 뒤에 붙이고 사용하기 */

// member
export interface Member {
  name: string;
  nickname: string;
  email: string;
  role: string;
  birth: string;
  birthType: string;
  image: string;
  mood: string | null;
  phoneNumber: string | null;
}

export interface MemberApiReq {
  name: string;
  nickname: string;
  birth: string;
  birthType: string;
  role: string;
  familyId: string;
  phoneNumber: null | string;
}

export interface CreateFamilyApiReq {
  name: string;
}

export interface Mood {
  name: string;
  mood: string;
  content: string;
}

// character
export interface Question {
  memberName: string;
  question: string;
  correctAnswer: string;
  answerList: string[];
}

export interface Character {
  question: string;
  answer: string;
}

// photo
export interface PhotoListProps {
  editMode: string,
  photoGroup: {
    id: number,
    dateTime: string,
    src: string
  }[],
  handleChecked: ((photoId: number, type: string) => void) | null;
}

export interface PhotoOutletInfoContext {
  editMode: string;
  handleChecked: (
    photoId: number,
    type: string,
  ) => void;
}

export interface PhotoData {
  id: number,
  dateTime: string,
  src: string
}

// schedule
export interface Schedule {
  title: string | null;
  content: string | null;
  category: string | null;
  color: string | null;
  startDate: string | null;
  endDate: string | null;
  participant: string[] | [];
}

export interface Holiday {
  title: string;
  start: string;
  backgroundColor: string;
  textColor: string;
}

export interface HolidayStore {
  years: string[];
  setYears: (newYear: string[]) => void;
  holidays: Holiday[];
  setHolidays: (newSchedules: Holiday[]) => void;
}

// kakao
declare global {
    interface Window {
        Kakao: any;
    }
}

//chat
export type ChatContent =  ChatMessage | ChatFile | ChatAppointment | ChatEmoji | ChatAlarm;

export interface ChatMessage {  // MESSAGE
  messageType: string;
  sender: string;
  time: string;
  unreadMember: string[];
  content: string;
}

export interface ChatFile { // FILE
  messageType: string;
  sender: string;
  time: string;
  unreadMember: string[];
  files: string[];
}

export interface ChatAppointment {  // APPOINTMENT
  messageType: string;
  sender: string;
  time: string;
  unreadMember: string[];
  content: string;
  participants: string[];
}

export interface ChatEmoji {  // EMOJI
  messageType: string;
  sender: string;
  time: string;
  unreadMember: string[];
  emojiId: string;
  content: string;
}

export interface ChatDateLine { // DATE_LINE
  messageType: string;
  time: string;
}

export interface ChatAlarm {  // ALARM
  messageType: string;
  sender: string;
  time: string;
  unreadMember: string[];
  content: string;
}

export enum SenderType {
  YOURS = "yours",
  MY = "my"
}

export enum ChatType {
  MESSAGE = "MESSAGE",
  FILE = "FILE",
  APPOINTMENT = "APPOINTMENT",
  EMOJI = "EMOJI",
  DATE_LINE = "DATE_LINE",
  ALARM = "ALARM"
}

export interface Emoji {
  name: string;
  image: string;
  item: EmojiItem[];
}

export interface EmojiItem {
  id: string;
  image: string;
}