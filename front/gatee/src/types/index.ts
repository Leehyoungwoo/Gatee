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

export interface Schedule {
  title: string | null;
  content: string | null;
  category: string | null;
  color: string | null;
  startDate: string | null;
  endDate: string | null;
  participant: string[] | [];
}

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

export interface PhotoData {
  id: number,
  dateTime: string,
  src: string
}

export interface Chat {
  chatList: ChatMessage[];
  cursor: number;
}

export interface ChatMessage {
  chatId: number;
  type: string;
  sender: string;
  message?: string;
  files?: ChatFile[];
  createdAt: string;
  readingCount: number;
  participants?: string[];
}

export interface ChatFile {
  S3Id: string;
  imgUrl: string;
  thumbnailUrl: string;
}

export enum SenderType {
  YOURS = "yours",
  MY = "my"
}

// 카카오 타입 지정
declare global {
    interface Window {
        Kakao: any;
    }
}

export interface EmojiItem {
  id: string;
  image: string;
}

export interface EmojiCategory {
  name: string;
  item: EmojiItem[];
}