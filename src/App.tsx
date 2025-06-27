import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Palette, Sun, Moon } from 'lucide-react';
import HatLogo from './assets/HATLogo';
import { HexColorPicker } from 'react-colorful';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ThemeProvider } from './components/theme-provider';
import { useTheme } from './components/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

gsap.registerPlugin(useGSAP);

function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function App() {
  const [hexColor, setHexColor] = useState('');
  const [opacity, setOpacity] = useState([80]);
  const [background, setBackground] = useState<'white' | 'black'>('white');
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const getAlphaHex = (opacityPercent: number) => {
    const alpha = Math.round((opacityPercent / 100) * 255);
    return alpha.toString(16).padStart(2, '0').toUpperCase();
  };

  const getHexAlpha = () => {
    const cleanHex = hexColor.replace('#', '');
    const alphaHex = getAlphaHex(opacity[0]);
    return `#${cleanHex}${alphaHex}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getHexAlpha());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isValidHex = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const handleHexChange = (value: string) => {
    if (value.startsWith('#')) {
      setHexColor(value.toUpperCase());
    } else {
      setHexColor(`#${value.toUpperCase()}`);
    }
  };

  const handlePickerChange = (color: string) => {
    setHexColor(color.toUpperCase());
  };

  useEffect(() => {
    if (!pickerOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 200 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'circ.out' }
    );
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -60 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'circ.out', delay: 0.15 }
    );
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'circ.out', delay: 0.4 }
    );
  });

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ModeToggle />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <div
              ref={logoRef}
              className={
                'flex justify-center mb-2 text-gray-900 dark:text-gray-100'
              }
            >
              <HatLogo className="h-16 w-auto" />
            </div>
          </div>
          <Card ref={cardRef} className="mb-6 shadow-lg border-0">
            <CardContent className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Hex Color Code
                </label>
                <div className="flex items-center gap-2 relative">
                  <Input
                    type="text"
                    value={hexColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="Hex color (e.g. #FF5733)"
                    className="text-lg font-mono text-center border-2 focus:border-blue-500"
                    maxLength={7}
                    hexMask
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-1"
                    title="Pick a color"
                    tabIndex={0}
                    onClick={() => setPickerOpen((v) => !v)}
                  >
                    <Palette className="w-5 h-5" />
                  </Button>
                  {pickerOpen && (
                    <div
                      ref={pickerRef}
                      className="absolute z-50 top-12 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border"
                      style={{ minWidth: 220 }}
                    >
                      <HexColorPicker
                        color={hexColor}
                        onChange={handlePickerChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
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
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Preview
                </label>
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
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
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
          <div
            ref={textRef}
            className="text-center text-sm text-gray-600 max-w-lg mx-auto leading-relaxed"
          >
            HexAlphaTool (HAT) is an online utility tool that allows users to
            add alpha transparency to hex color codes on the fly.
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
