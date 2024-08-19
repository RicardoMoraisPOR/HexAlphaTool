import { CSSObject } from 'styled-components';

type ThemeColor = NonNullable<CSSObject['color']>;

export type Palette = {
  background: ThemeColor;
  primary: ThemeColor;
  accent: ThemeColor;
  secondary: ThemeColor;
  text: ThemeColor;
};
export type Transitions = {
  fast: number;
  normal: number;
  slow: number;
};

export type Breakpoints = {
  mobile: string;
  tablet: string;
  desktop: string;
};

export type BreakpointTypes = {
  max: Breakpoints;
  min: Breakpoints;
};

export default interface Theme {
  breakpoints: BreakpointTypes;
  transitions: Transitions;
  font: NonNullable<CSSObject['fontFamily']>;
  palette: Palette;
}
