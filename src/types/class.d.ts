interface Class {
  id: number;
  classCode: string;
  className: string;
  day: string;
  timeFrom: string;
  timeTo: string;
  user_id: string;
  created_at: string;
  classGroup: string;
  class_img?: string;
}

interface ClassWithPoints extends Class {
  points: number;
  pointsHistory: number[];
}
