import { IntRange } from 'type-fest';

/**
 * applies transparency to a given color
 * @param color         color to be processed
 * @param transparency  transparency to apply. values from 0 to 100
 * @returns             color transformed
 */
export const alphaHexConverter = (
  color: string,
  transparency: IntRange<0, 101>
) => {
  let parsedColor = color;

  if (parsedColor.length === 9) {
    parsedColor = parsedColor.substring(0, 7);
  }

  if (parsedColor.length !== 7 || parsedColor[0] !== '#') {
    throw `Invalid hexadecimal color: ${color}`;
  }

  const roundedTransparency = transparency / 100;

  if (roundedTransparency < 0 || roundedTransparency > 1) {
    throw `Invalid transparency value: ${roundedTransparency}`;
  }

  // Calculate transparency value as a two-digit hexadecimal
  const parsedTransparency = Math.round(roundedTransparency * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');

  return `${parsedColor}${parsedTransparency}`;
};

/**
 * interpolate between two hexadecimal values by converting them to decimal, calculating the intermediate values, and then converting them back to hexadecimal.
 * @param hexFrom      hex color from
 * @param hexTo        hex color to
 * @param steps        number of intermediate hex values
 * @returns            array of intermediate hex values
 */
export const interpolateHexColors = (
  hexFrom: string,
  hexTo: string,
  steps: IntRange<0, 20>
) => {
  // Convert the hexadecimal values to decimal
  const decimal1 = parseInt(hexFrom.slice(1), 16);
  const decimal2 = parseInt(hexTo.slice(1), 16);

  // Calculate the step size for each color channel
  const stepR = (decimal2 >> 16) - (decimal1 >> 16);
  const stepG = ((decimal2 >> 8) & 0xff) - ((decimal1 >> 8) & 0xff);
  const stepB = (decimal2 & 0xff) - (decimal1 & 0xff);

  // Initialize an array to store the intermediate colors
  const intermediateColors = [];

  // Calculate and store the intermediate colors
  for (let i = 0; i <= steps; i++) {
    const r = ((decimal1 >> 16) + i * (stepR / steps)) & 0xff;
    const g = (((decimal1 >> 8) & 0xff) + i * (stepG / steps)) & 0xff;
    const b = ((decimal1 & 0xff) + i * (stepB / steps)) & 0xff;

    // Convert the decimal values back to hexadecimal
    const interpolatedHex = `#${((r << 16) | (g << 8) | b)
      .toString(16)
      .padStart(6, '0')}`;

    intermediateColors.push(interpolatedHex);
  }

  return intermediateColors;
};

export const invertHexColor = (hex: string) => {
  // Remove the '#' if it is there
  const color = hex.startsWith('#') ? hex.slice(1) : hex;

  // Parse the color as a number
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Invert each color component
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  // Convert the RGB back to a hex string and pad with zeroes if necessary
  const invertedColor = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return invertedColor;
};

export const isColorLight = (hex: string) => {
  // Remove the '#' if it is there
  const color = hex.startsWith('#') ? hex.slice(1) : hex;

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate the relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return whether the color is light or dark
  return luminance > 128;
};

export const getLuminanceLevel = (hex: string) => {
  // Remove the '#' if it is there
  const color = hex.startsWith('#') ? hex.slice(1) : hex;

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate the relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return whether the color is light or dark
  return luminance;
};
