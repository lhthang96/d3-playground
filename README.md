# D3 Playground

A place for having fun with D3.

## What is D3

D3 - Data-Driven Document is a library that can help you bring data to life via browser. It provides a set of tools such as chart generator (line, area, pie,...), scaling, axes, transition,... for visualizing data using (typically) SVG element.

## Working with D3

The basic idea is:
1. Create a SVG element.
2. Use D3 (or DOM) selector for selecting and creating components such as `g`, `path`, `line`, `circle`,...
3. Use D3 tools:
  - Scaling: `d3.scaleTime`, `d3.scaleLinear`, `d3.scaleBand`,...
  - Axes: `d3.axisLeft`, `d3.axisBottom`, `d3.axisTop`, `d3.axisRight`.
  - Chart generator: `d3.line`, `d3.area`, `d3.pie`,...
  - Transition: duration, easing functions.
4. Use `class` or `style` for styling components.

## What have been done

1. Simple line chart

<img src="https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/simple_line_chart_with_label.png?alt=media" alt="Simple line chart" width="500" height="300" />

2. Simple bar chart

<img src="https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/bar_chart_min.png?alt=media" alt="Simple bar chart" width="500" height="300" />

3. Realtime line chart

<img src="https://firebasestorage.googleapis.com/v0/b/d3-playground-a2874.appspot.com/o/realtime_line_chart.gif?alt=media" alt="Realtime line chart" width="500" height="300" />

## TODO

1. Bar chart
  - Add hover class
  - Add tooltip for showing value

2. Realtime line chart
  - Add tooltip for showing value

3. Line chart
  - Colorize upper and lower area which separated by a threshold line
