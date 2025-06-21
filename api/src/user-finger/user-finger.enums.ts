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

export interface AcsEventCondResponse {
  AcsEvent: {
    searchID: string;
    totalMatches: number;
    responseStatusStrg: 'OK';
    numOfMatches: number;
    InfoList: {
      major: number;
      minor: number;
      time: string;
      cardType: number;
      name: string;
      cardReaderNo: number;
      door_no: number;
      employee_no_string: string;
      serialNo: number;
      userType: string;
      current_verify_mode: string;
      mask: string;
      pictureURL: string;
      FaceRect: object;
    }[];
  };
}
