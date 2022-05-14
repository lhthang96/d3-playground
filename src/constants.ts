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
    thumbnail: 'https://cdn.ablebits.com/_img-blog/line-graph/line-graph-excel.png',
    caption: 'Simple line chart',
  },
  {
    id: 'simple-bar-chart',
    thumbnail: 'https://www.metabase.com/learn/images/master-the-bar-chart-visualization/bar-chart.png',
    caption: 'Simple bar chart',
  },
];
