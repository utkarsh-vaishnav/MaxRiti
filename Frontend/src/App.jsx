import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Create from './pages/Create';
import View from './pages/View';
import Status from './pages/Status';
import FeaturesPage from './pages/FeaturesPage';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/view" element={<View />} />
                <Route path="/status" element={<Status />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;