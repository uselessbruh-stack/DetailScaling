import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Playground from './pages/Playground';
import Analytics from './pages/Analytics';
import Gallery from './pages/Gallery';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sandbox" element={<Playground />} />
          <Route path="/benchmarks" element={<Analytics />} />
          <Route path="/library" element={<Gallery />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
