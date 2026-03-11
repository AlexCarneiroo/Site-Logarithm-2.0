import { useEffect } from 'react';
import Hero from './components/Hero';

function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as a percentage of the window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Update CSS variables on the root element
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      {/* Background Gradients & Noise Overlay */}
      <div className="bg-gradients"></div>
      <div className="noise-overlay"></div>

      {/* Main Hero Section */}
      <Hero />
      
      {/* Placeholder for the next section to show scrolling */}
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }}>Próxima Seção (Serviços)</h2>
      </section>
    </div>
  );
}

export default App;
