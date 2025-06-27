import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import HatLogo from './assets/HATLogo';

export default function App() {
  const [hexColor, setHexColor] = useState('#FF5733');
  const [opacity, setOpacity] = useState([80]);
  const [background, setBackground] = useState<'white' | 'black'>('white');
  const [copied, setCopied] = useState(false);

  // Convert opacity percentage to hex alpha
  const getAlphaHex = (opacityPercent: number) => {
    const alpha = Math.round((opacityPercent / 100) * 255);
    return alpha.toString(16).padStart(2, '0').toUpperCase();
  };

  // Get the final hex+alpha color
  const getHexAlpha = () => {
    const cleanHex = hexColor.replace('#', '');
    const alphaHex = getAlphaHex(opacity[0]);
    return `#${cleanHex}${alphaHex}`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getHexAlpha());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Validate hex color input
  const isValidHex = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  // Handle hex input change
  const handleHexChange = (value: string) => {
    if (value.startsWith('#')) {
      setHexColor(value.toUpperCase());
    } else {
      setHexColor(`#${value.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <HatLogo className="h-16 w-auto" />
          </div>
        </div>

        {/* Main Tool Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-8">
            {/* Hex Color Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hex Color Code
              </label>
              <Input
                type="text"
                value={hexColor}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FF5733"
                className="text-lg font-mono text-center border-2 focus:border-blue-500"
                maxLength={7}
              />
            </div>

            {/* Opacity Slider */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Opacity: {opacity[0]}%
              </label>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Preview Area */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preview
              </label>

              {/* Background Toggle */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={background === 'white' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBackground('white')}
                  className="text-xs"
                >
                  White Background
                </Button>
                <Button
                  variant={background === 'black' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBackground('black')}
                  className="text-xs"
                >
                  Black Background
                </Button>
              </div>

              {/* Color Preview */}
              <div
                className={`w-full h-32 rounded-lg border-2 border-gray-200 relative overflow-hidden ${
                  background === 'white' ? 'bg-white' : 'bg-black'
                }`}
              >
                {isValidHex(hexColor) && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: hexColor,
                      opacity: opacity[0] / 100,
                    }}
                  />
                )}
                {!isValidHex(hexColor) && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Invalid hex color
                  </div>
                )}
              </div>
            </div>

            {/* Result and Copy */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Hex + Alpha Result
              </label>

              <div className="flex gap-3">
                <Input
                  type="text"
                  value={isValidHex(hexColor) ? getHexAlpha() : 'Invalid hex'}
                  readOnly
                  className="text-lg font-mono text-center bg-gray-50 border-2"
                />
                <Button
                  onClick={copyToClipboard}
                  disabled={!isValidHex(hexColor)}
                  className="px-6 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <div className="text-center text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          HexAlphaTool (HAT) is an online utility tool that allows users to add
          alpha transparency to hex color codes on the fly.
        </div>
      </div>
    </div>
  );
}
