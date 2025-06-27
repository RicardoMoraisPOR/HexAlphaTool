export function isValidHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

export function getAlphaHex(opacityPercent: number): string {
  const alpha = Math.round((opacityPercent / 100) * 255);
  return alpha.toString(16).padStart(2, '0').toUpperCase();
}

export function getHexAlpha(hexColor: string, opacity: number): string {
  const cleanHex = hexColor.replace('#', '');
  const alphaHex = getAlphaHex(opacity);
  return `#${cleanHex}${alphaHex}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return [0, 0, 0];
  const bigint = parseInt(cleanHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function colorDistance(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

export function getComputedBgRgb(): [number, number, number] {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim();
  if (bg.startsWith('oklch')) {
    if (bg.includes('0.141')) return [20, 20, 30];
    if (bg.includes('1 ')) return [255, 255, 255];
    return [255, 255, 255];
  }
  if (bg.startsWith('#')) {
    return hexToRgb(bg) as [number, number, number];
  }
  if (bg.startsWith('rgb')) {
    const match = bg.match(/\d+/g);
    if (match && match.length >= 3) {
      return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
    }
  }
  // fallback
  return [255, 255, 255];
}

export function isColorSimilarToBg(hex: string): boolean {
  if (!isValidHex(hex)) return false;
  const fgRgb: [number, number, number] = hexToRgb(hex);
  const bgRgb: [number, number, number] = getComputedBgRgb();
  return colorDistance(fgRgb, bgRgb) < 40;
}
