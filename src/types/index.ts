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
  toolResult?: any;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface IncidentReport {
  description: string;
  location: string;
}
