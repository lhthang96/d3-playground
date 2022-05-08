export interface RealtimeData {
  time: number;
  value: number;
}

export interface D3Data<T = any> {
  label?: string;
  values: T[];
}

export interface MockupTemperatureData {
  date: string;
  temperature: string;
}
