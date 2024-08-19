import HatLogo from './assets/HatLogo';

function App() {
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        flexDirection: 'column',
        gap: '30px',
        padding: '30px',
      }}
    >
      <HatLogo height={200} />
      <span style={{ letterSpacing: 1.5, textAlign: 'center' }}>
        🚧This website is currently under development. Stay tuned for updates!
        Explore the project’s code on{' '}
        <a href="https://github.com/RicardoMoraisPOR/HexAlphaTool/tree/dev">
          GitHub
        </a>
        .🚧
      </span>
    </main>
  );
}

export default App;
