import type { BarChartStyles, ChartSelectorItem, ChartStyles, LineChartStyles } from './interfaces';

export const COLORS = {
  PRIMARY: '#b87131',
  SECONDARY: '#ffdbab',
  BACKGROUND: '#fdfcdb',
  TEXT: '#3c3d1b',
  CHART_PRIMARY: '#4682B4',
};

export const DEFAULT_CHART_STYLES: ChartStyles = {
  width: 500,
  height: 300,
  color: COLORS.CHART_PRIMARY,
  backgroundColor: COLORS.BACKGROUND,
  containerPadding: {
    top: 40,
    bottom: 20,
    left: 50,
    right: 20,
  },
};

export const DEFAULT_BAR_CHART_STYLES: BarChartStyles = {
  ...DEFAULT_CHART_STYLES,
  barPadding: 5,
};

export const DEFAULT_LINE_CHART_STYLES: LineChartStyles = DEFAULT_CHART_STYLES;

export const CHART_SELECTOR_ITEMS: ChartSelectorItem[] = [
  {
    id: 'simple-line-chart',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/line_chart_min.png?alt=media',
    caption: 'Simple line chart',
  },
  {
    id: 'simple-bar-chart',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/bar_chart_min.png?alt=media',
    caption: 'Simple bar chart',
  },
  {
    id: 'realtime-line-chart',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/line_chart_min.png?alt=media',
    caption: 'Realtime line chart',
  },
];
