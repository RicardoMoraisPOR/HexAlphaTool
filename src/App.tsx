import { useReducer, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Palette } from 'lucide-react';
import HatLogo from './assets/HatLogo';
import { HexColorPicker } from 'react-colorful';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ThemeProvider } from './components/theme-provider';
import {
  isValidHex,
  getHexAlpha,
  isColorSimilarToBg,
  getAlphaHex,
} from './utils/color';
import ModeToggle from './components/inner-components/ModeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

gsap.registerPlugin(useGSAP);

type State = {
  hexColor: string;
  opacity: number;
  background: 'white' | 'black';
  copied: boolean;
  logoHovered: boolean;
  isValid: boolean;
};

type Action =
  | { type: 'SET_HEX_COLOR'; value: string }
  | { type: 'SET_OPACITY'; value: number }
  | { type: 'SET_BACKGROUND'; value: 'white' | 'black' }
  | { type: 'SET_COPIED'; value: boolean }
  | { type: 'SET_LOGO_HOVERED'; value: boolean };

const initialState: State = {
  hexColor: '',
  opacity: 80,
  background: 'white',
  copied: false,
  logoHovered: false,
  isValid: false,
};

const LAST_HEX_KEY = 'last-hex-color';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_HEX_COLOR': {
      const hexColor = action.value.startsWith('#')
        ? action.value.toUpperCase()
        : `#${action.value.toUpperCase()}`;
      return {
        ...state,
        hexColor,
        isValid: isValidHex(hexColor),
      };
    }
    case 'SET_OPACITY':
      return { ...state, opacity: action.value };
    case 'SET_BACKGROUND':
      return { ...state, background: action.value };
    case 'SET_COPIED':
      return { ...state, copied: action.value };
    case 'SET_LOGO_HOVERED':
      return { ...state, logoHovered: action.value };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hatLogoRef = useRef<SVGSVGElement | null>(null);
  const [lastHex, setLastHex] = useLocalStorage<string>(LAST_HEX_KEY, '');
  const validHexRef = useRef<HTMLSpanElement>(null);
  const invalidHexRef = useRef<HTMLSpanElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        getHexAlpha(state.hexColor, state.opacity)
      );
      dispatch({ type: 'SET_COPIED', value: true });
      setTimeout(() => dispatch({ type: 'SET_COPIED', value: false }), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (state.isValid) {
      setLastHex(state.hexColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hexColor, state.isValid]);

  useEffect(() => {
    if (lastHex && !state.hexColor) {
      dispatch({ type: 'SET_HEX_COLOR', value: lastHex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastHex]);

  useGSAP(() => {
    if (hatLogoRef.current) {
      gsap.set(hatLogoRef.current, { opacity: 0, y: -50 });
      gsap.to(hatLogoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        delay: 0.2,
      });
    }
  }, []);

  useGSAP(() => {
    if (validHexRef.current && invalidHexRef.current) {
      if (state.isValid) {
        gsap.to(validHexRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'circ.out',
          pointerEvents: 'auto',
        });
        gsap.to(invalidHexRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: 'circ.out',
          pointerEvents: 'none',
        });
      } else {
        gsap.to(validHexRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'circ.out',
          pointerEvents: 'none',
        });
        gsap.to(invalidHexRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'circ.out',
          pointerEvents: 'auto',
        });
      }
    }
  }, [state.isValid]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ModeToggle />
      <div className="min-h-screen bg-background dark:bg-background p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center mb-2 relative">
              <HatLogo
                ref={hatLogoRef}
                className="h-16 w-auto"
                color={
                  state.isValid &&
                  state.logoHovered &&
                  !isColorSimilarToBg(state.hexColor)
                    ? state.hexColor
                    : undefined
                }
                onMouseEnter={() =>
                  dispatch({ type: 'SET_LOGO_HOVERED', value: true })
                }
                onMouseLeave={() =>
                  dispatch({ type: 'SET_LOGO_HOVERED', value: false })
                }
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Hex Color Code
                </label>
                <div className="flex items-center gap-2 relative">
                  <Input
                    value={state.hexColor}
                    onChange={(e) =>
                      dispatch({ type: 'SET_HEX_COLOR', value: e.target.value })
                    }
                    placeholder="Hex color (e.g. #FF5733)"
                    className="text-lg font-mono text-center focus:border-blue-500"
                    maxLength={7}
                    hexMask
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="ml-1"
                        title="Pick a color"
                        tabIndex={0}
                      >
                        <Palette className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="p-0 bg-card border-1 rounded-lg shadow-lg"
                      style={{ minWidth: 220 }}
                    >
                      <div className="p-4">
                        <HexColorPicker
                          color={state.hexColor}
                          onChange={(color) =>
                            dispatch({ type: 'SET_HEX_COLOR', value: color })
                          }
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">
                  Opacity: {state.opacity}%
                </label>
                <Slider
                  value={[state.opacity]}
                  onValueChange={([value]) =>
                    dispatch({ type: 'SET_OPACITY', value })
                  }
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Preview
                </label>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={
                      state.background === 'white' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      dispatch({ type: 'SET_BACKGROUND', value: 'white' })
                    }
                    className="text-xs  border-1"
                  >
                    White Background
                  </Button>
                  <Button
                    variant={
                      state.background === 'black' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      dispatch({ type: 'SET_BACKGROUND', value: 'black' })
                    }
                    className="text-xs border-1"
                  >
                    Black Background
                  </Button>
                </div>
                <div
                  className={`w-full h-32 border-1 [border-color:var(--border)] relative overflow-hidden ${
                    state.background === 'white' ? 'bg-white' : 'bg-black'
                  }`}
                >
                  {state.isValid && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: state.hexColor,
                        opacity: state.opacity / 100,
                      }}
                    />
                  )}
                  {!state.isValid && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                      Invalid hex code
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold">
                  Hex + Alpha Result
                </label>
                <div className="border-1 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div style={{ position: 'relative', minHeight: 32 }}>
                        <span
                          ref={validHexRef}
                          className="text-2xl font-mono font-bold mb-1 block"
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            opacity: state.isValid ? 1 : 0,
                          }}
                        >
                          {state.hexColor}
                          <span style={{ opacity: 0.5 }}>
                            {getAlphaHex(state.opacity)}
                          </span>
                        </span>
                        <span
                          ref={invalidHexRef}
                          className="text-xs text-gray-400 block"
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            opacity: state.isValid ? 0 : 1,
                          }}
                        >
                          Invalid hex code
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      disabled={!state.isValid}
                      size="lg"
                      className="ml-4 px-6 flex items-center gap-2"
                    >
                      {state.copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-sm max-w-lg mx-auto leading-relaxed">
            <span style={{ opacity: 0.7 }}>
              HexAlphaTool (HAT) is an online utility tool that allows users to
              add alpha transparency to hex color codes on the fly.
            </span>
            <div className="mt-4 text-xs text-center">
              <span className="opacity-50 ">made by </span>
              <a
                href="https://www.ricardomorais.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="underline underline-offset-2 opacity-50 hover:opacity-100">
                  www.ricardomorais.dev
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
