export enum Role {
  SUPER_ADMIN = 1,
  ADMINISTRATOR = 2,
  TECHNICIAN = 3,
  STOREMAN = 4,
  SUPERVISOR = 5,
}

export const RoleName: { [key in Role]: string } = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.ADMINISTRATOR]: 'Administrator',
  [Role.TECHNICIAN]: 'Technician',
  [Role.STOREMAN]: 'Storeman',
  [Role.SUPERVISOR]: 'Supervisor',
};

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

export interface ResponseFinger {
  FingerPrintInfo: FingerPrintInfo;
}

export interface FingerPrintInfo {
  searchID: string;
  status: string;
  FingerPrintList: FingerPrintList[];
}

export interface FingerPrintList {
  cardReaderNo: number;
  fingerPrintID: number;
  fingerType: string;
  fingerData: string;
  leaderFP: any[];
}

export interface UserItemRequest {
  employeeNo: string;
  name: string;
  userType: string;
  sortByNamePosition: number;
  sortByNameFlag: string;
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
  faceURL: string;
  fingerList: FingerList[];
  employee_hik: string;
  face_hik: string;
}

export interface PersonInfoExtend {
  value: string;
}

export interface RightPlan {
  doorNo: number;
  planTemplateNo: string;
}

export interface FingerList {
  cardReaderNo: number;
  fingerPrintID: number;
  fingerType: string;
  fingerData: string;
  leaderFP: any[];
}
export const mockUser: any = [
  {
    employeeNo: '1',
    name: 'Minh Test',
    userType: 'normal',
    sortByNamePosition: 0,
    sortByNameFlag: 'M',
    closeDelayEnabled: false,
    Valid: {
      enable: true,
      beginTime: '2025-03-18T00:00:00',
      endTime: '2035-03-17T23:59:59',
      timeType: 'local',
    },
    belongGroup: '',
    password: '',
    doorRight: '1',
    RightPlan: [{ doorNo: 1, planTemplateNo: '1' }],
    maxOpenDoorTime: 0,
    openDoorTime: 0,
    roomNumber: 0,
    floorNumber: 0,
    localUIRight: true,
    gender: 'unknown',
    numOfCard: 0,
    numOfFP: 0,
    numOfFace: 1,
    PersonInfoExtends: [{ value: '' }],
    faceURL: 'api/uploads/avatars/0000000004.jpg',
  },
  {
    employeeNo: 'superadmin',
    name: 'Super Admin',
    userType: 'normal',
    sortByNamePosition: 1,
    sortByNameFlag: 'S',
    closeDelayEnabled: false,
    Valid: {
      enable: true,
      beginTime: '2025-03-26T00:00:00',
      endTime: '2035-03-26T23:59:59',
      timeType: 'local',
    },
    belongGroup: '',
    password: '',
    doorRight: '1',
    RightPlan: [{ doorNo: 1, planTemplateNo: '1' }],
    maxOpenDoorTime: 0,
    openDoorTime: 0,
    roomNumber: 0,
    floorNumber: 0,
    localUIRight: false,
    gender: 'male',
    numOfCard: 0,
    numOfFP: 2,
    numOfFace: 1,
    PersonInfoExtends: [{ value: '' }],
    faceURL: 'api/uploads/avatars/0000000005.jpg',
    fingerList: [
      {
        cardReaderNo: 1,
        fingerPrintID: 1,
        fingerType: 'normalFP',
        fingerData:
          'MzAxIRTtFIisRh0VJsfgDya5FSe96STpFffEcS4lJfjYwjDlJMjkuHN9JWuclBERJbi00i15Jg7ZkT2hFi7RpF1xJpupdFjNJg7Fw3q5Jp6w36TNFl6MdcHVFlig6NuhFji0AC61JQvKVk2NFHi0pYq5JDiwj6FpFEjIiMSxFCjghQpiFijofg6VJ5+MrShJF47IrlVhF46wwXZVJ36c0YYNF36cbYs1J16Y26+RF06U39VUJJiwWPH0JHjA1vWEFn7kh/7kJZvscwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXhMAAhZWNNYGlDpfAdGaCnR6YQJRoAzfeAISkIoLww1LMxEzCaSJSBKDfBBWqhMAcekabW4aMTONCJFDUSAi2wLpMlQh4bgNdY8/EUAGAQ+dGkVxthKPYSggAYob20EWAQO5GdFPKUEyYwW4bi8ldUERpZ1aEzG3DuixFRHh6QfSj2wRJLoARgAAAAAASYs=',
        leaderFP: [],
      },
      {
        cardReaderNo: 1,
        fingerPrintID: 2,
        fingerType: 'normalFP',
        fingerData:
          'MzAxG0kJJW/InEmdJe/AqmS1JF68Gn7tFY+cyNNNFi6Qa9utJW6k5wA2FUu4AxxRJV/wKSWlJDvsI66ZJm+o0ue9FiucZgIaFmuY4zAeJVjAB/XYE3jwC/9IJEjoFAqRJFj4jBglJGjoISOFE2jIHl3tEyjQJpq5EyiwH+JQJWfQGI5BF1SoxbUFJzTAXhkWFnSwdN/0JYSgGeGEFrS4HBPlFmSgsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYRMAlgKVxOkDyHZeN8G4AhpuEkMyygGqrloiMZYAnO5OMjMCBedbDQRCIQnSLiQiQYcEa7kJVXPsEiaPAiNDBQcpei3ONY4TH0MBBBIQFl5AJC0IqhXF3A40M+QGA25sMDB6D4xiISEQjBAh7TnEF+4asq1ABWUEF3QuOwAxIg4UA0tiAgMYGQAAAAAAnlQ=',
        leaderFP: [],
      },
    ],
  },
];
