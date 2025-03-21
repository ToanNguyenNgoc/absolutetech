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
