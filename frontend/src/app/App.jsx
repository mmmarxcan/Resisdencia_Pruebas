import './App.css';
import FormularioSolicitud from '../pages/FormularioSolicitud';

function App() {
  return (
    <div className="App">
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <h1>WLS Logistics</h1>
      </header>
    
      <main>
        <FormularioSolicitud />
      </main>
    </div>
  );
}

export default App;