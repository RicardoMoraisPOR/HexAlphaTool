import HatLogo from './assets/HatLogo';
import AppThemeProvider from './theme/AppThemeProvider';

function App() {
  return (
    <AppThemeProvider>
      <main
        style={{
          padding: '4rem',
          display: 'flex',
          width: '100vw',
          height: '100vh',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '5rem',
        }}
      >
        <HatLogo fill="#fff" height={200} />
        <span>
          HexAlphaTool (HAT) is an online utility tool that allows users to add
          alpha transparency to hex color codes, enabling users to generate hex
          color codes on the fly.
        </span>
        <div
          style={{
            display: 'flex',
            background: 'blue',
            width: 'fit-content',
            height: '6rem',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <input />
        </div>
      </main>
    </AppThemeProvider>
  );
}

export default App;
