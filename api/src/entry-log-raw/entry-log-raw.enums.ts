export interface AcsEventCond {
  searchID: string;
  searchResultPosition: number;
  maxResults?: number;
  major: number;
  minor: number;
  startTime?: string;
  endTime?: string;
  cardNo?: string;
  name?: string;
  timeReverseOrder?: boolean;
}

export interface InfoList {
  major: number;
  minor: number;
  time: string;
  cardType: number;
  name: string;
  cardReaderNo: number;
  doorNo: number;
  employeeNoString: string;
  serialNo: number;
  userType: string;
  currentVerifyMode: string;
  mask: string;
  pictureURL: string;
  FaceRect: object;
}

export interface AcsEventCondResponse {
  AcsEvent: {
    searchID: string;
    totalMatches: number;
    responseStatusStrg: 'OK' | 'NO MATCH' | 'MORE';
    numOfMatches: number;
    InfoList: InfoList[];
  };
}
