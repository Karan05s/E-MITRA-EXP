export interface User {
  id: string;
  name: string;
  mobile: string;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}
