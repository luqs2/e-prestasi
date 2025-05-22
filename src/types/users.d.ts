interface UserProfile {
  id: string;
  user_id: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  user_avatar?: string;
  email?: string;
}


interface ClassUser {
 
  id?: number;
  class_id?: number;
  user_id?: string;
  created_at?: string;
  points: number;
  profiles: UserProfile; 
}