export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMINISTRATOR = 'Administrator',
  ADMIN_SUPPORT = 'Admin Support',
  MAINTAINER = 'Maintainer',
  STAFF = 'Staff',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  'unknown' = 'unknown',
  'male' = 'male',
  'female' = 'female',
}

export interface Valid {
  enable: boolean;
  beginTime: string; // ISO 8601
  endTime: string; // ISO 8601
  timeType: 'local' | 'utc'; // Có thể thêm các giá trị khác nếu cần
}

export interface RightPlan {
  doorNo: number;
  planTemplateNo: string;
}

export interface UserInfo {
  employeeNo: string;
  name: string;
  userType: 'normal' | 'admin' | 'guest'; // Các loại user có thể có
  Valid: Valid;
  doorRight: string;
  RightPlan: RightPlan[];
}

// Response từ API (giả định dựa trên ISAPI)
export interface CreatePersonResponse {
  status: string; // 'OK' hoặc 'Fail'
  message?: string;
  data?: any; // Có thể cụ thể hơn nếu biết cấu trúc chính xác
}

export interface AcsEventCond {
  searchID: string;
  searchResultPosition: number;
  maxResults?: number;
  major: number;
  minor: number;
  startTime?: Date;
  endTime?: Date;
  cardNo?: string;
  name?: string;
  timeReverseOrder?: boolean;
}

//get list user from HIK
export interface UserInfoSearch {
  searchID: string;
  responseStatusStrg: string;
  numOfMatches: number;
  totalMatches: number;
  UserInfo: UserInfoItem[];
}

export interface UserInfoItem {
  employeeNo: string;
  name: string;
  userType: 'normal' | 'admin' | 'guest';
  sortByNamePosition: number;
  sortByNameFlag: SortByNameFlag;
  closeDelayEnabled: boolean;
  Valid: Valid;
  belongGroup: string;
  password: string;
  doorRight: string;
  RightPlan: RightPlan[];
  maxOpenDoorTime: number;
  openDoorTime: number;
  roomNumber: number;
  floorNumber: number;
  localUIRight: boolean;
  gender: Gender;
  numOfCard: number;
  numOfFP: number;
  numOfFace: number;
  PersonInfoExtends: PersonInfoExtend[];
  faceURL?: string;
}

export interface PersonInfoExtend {
  value: string;
}

export interface RightPlan {
  doorNo: number;
  planTemplateNo: string;
}

export enum SortByNameFlag {
  M = 'M',
  N = 'N',
}
