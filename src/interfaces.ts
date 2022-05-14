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

export interface ChartStyles {
  containerPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  backgroundColor?: string;
  color?: string;
  width?: number;
  height?: number;
}

export interface BarChartStyles extends ChartStyles {
  barPadding?: number;
}

export interface LineChartStyles extends ChartStyles {}
