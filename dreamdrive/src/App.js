import React, { useState, useContext, createContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, Menu, X, ChevronRight, Star, MapPin, Fuel, Zap, Users, Calendar, DollarSign, CheckCircle, Plus, Minus, Trash2, Eye, ArrowRight } from 'lucide-react';

// ==================== CONTEXTS ====================
const CartContext = createContext();
const WishlistContext = createContext();
const ThemeContext = createContext();

// ==================== LUXURY CAR DATA ====================
const luxuryCars = [
  {
    id: 1,
    brand: 'Ferrari',
    model: 'F8 Tributo',
    price: 2800000,
    rentalPrice: 15000,
    image: '/images/ferrari-f8-tributo.jpg',
    color: 'Rosso Corsa',
    year: 2024,
    acceleration: '2.9s',
    maxSpeed: '340',
    power: '710 HP',
    fuel: 'Petrol',
    seats: 2,
    rating: 4.9,
    reviews: 324,
    featured: true
  },
  {
    id: 2,
    brand: 'Lamborghini',
    model: 'Revuelto',
    price: 2900000,
    rentalPrice: 16000,
    image: '/images/Lambo-revuelto.jpg',
    color: 'Giallo Midas',
    year: 2024,
    acceleration: '2.5s',
    maxSpeed: '350',
    power: '1001 HP',
    fuel: 'Hybrid',
    seats: 2,
    rating: 4.8,
    reviews: 287,
    featured: true
  },
  {
    id: 3,
    brand: 'Porsche',
    model: '911 Turbo',
    price: 1950000,
    rentalPrice: 12000,
    image: '/images/Porche-911Turbo.jpg',
    color: 'Black',
    year: 2024,
    acceleration: '2.7s',
    maxSpeed: '330',
    power: '640 HP',
    fuel: 'Petrol',
    seats: 2,
    rating: 4.8,
    reviews: 456,
    featured: true
  },
  {
    id: 4,
    brand: 'Bugatti',
    model: 'Bolide',
    price: 4500000,
    rentalPrice: 25000,
    image: '/images/Bugatti-bolide.jpg',
    color: 'Royal Blue',
    year: 2024,
    acceleration: '2.2s',
    maxSpeed: '380',
    power: '1500 HP',
    fuel: 'Petrol',
    seats: 2,
    rating: 5.0,
    reviews: 189,
    featured: true
  },
  {
    id: 5,
    brand: 'Mercedes-Benz',
    model: 'AMG GT',
    price: 1850000,
    rentalPrice: 11000,
    image: '',
    color: 'Diamond White',
    year: 2024,
    acceleration: '3.1s',
    maxSpeed: '320',
    power: '630 HP',
    fuel: 'Petrol',
    seats: 2,
    rating: 4.7,
    reviews: 512,
    featured: false
  },
  {
    id: 6,
    brand: 'McLaren',
    model: '765LT',
    price: 2400000,
    rentalPrice: 14000,
    image: '/images/mclaren-765lt.jpg',
    color: 'Papaya Spark',
    year: 2024,
    acceleration: '2.8s',
    maxSpeed: '330',
    power: '765 HP',
    fuel: 'Petrol',
    seats: 2,
    rating: 4.9,
    reviews: 378,
    featured: true
  },
  {
    id: 7,
    brand: 'Aston Martin',
    model: 'DB12',
    price: 2100000,
    rentalPrice: 13000,
    image: '',
    color: 'British Racing Green',
    year: 2024,
    acceleration: '3.2s',
    maxSpeed: '325',
    power: '680 HP',
    fuel: 'Petrol',
    seats: 4,
    rating: 4.8,
    reviews: 234,
    featured: false
  },
  {
    id: 8,
    brand: 'Rolls-Royce',
    model: 'Phantom',
    price: 6000000,
    rentalPrice: 30000,
    image: '',
    color: 'Midnight Purple',
    year: 2024,
    acceleration: '5.1s',
    maxSpeed: '250',
    power: '563 HP',
    fuel: 'Petrol',
    seats: 5,
    rating: 5.0,
    reviews: 145,
    featured: true
  }
];

const brands = ['Ferrari', 'Lamborghini', 'Porsche', 'Bugatti', 'Mercedes-Benz', 'McLaren', 'Aston Martin', 'Rolls-Royce'];
const reviews = [
  { author: 'Rajesh K.', text: 'Exceptional service and premium selection!', rating: 5 },
  { author: 'Priya S.', text: 'Dream drive experience, highly recommend!', rating: 5 },
  { author: 'Arjun M.', text: 'Professional team, amazing cars!', rating: 4.8 },
  { author: 'Neha P.', text: 'Best luxury car platform in India!', rating: 5 }
];

// ==================== PROVIDERS ====================
const CartProvider = ({ children, onCountChange }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dreamdrive_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dreamdrive_cart', JSON.stringify(cartItems));
    if (typeof onCountChange === 'function') {
      onCountChange(cartItems.length);
    }
  }, [cartItems, onCountChange]);

  const addToCart = (car, type = 'buy') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === car.id && item.type === type);
      if (existing) {
        return prev.map(item =>
          item.id === car.id && item.type === type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...car, quantity: 1, type }];
    });
  };

  const removeFromCart = (id, type) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id && item.type === type ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

const WishlistProvider = ({ children, onCountChange }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dreamdrive_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dreamdrive_wishlist', JSON.stringify(wishlistItems));
    if (typeof onCountChange === 'function') {
      onCountChange(wishlistItems.length);
    }
  }, [wishlistItems, onCountChange]);

  const addToWishlist = (car) => {
    setWishlistItems(prev => 
      prev.find(item => item.id === car.id) ? prev : [...prev, car]
    );
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

const AuthPage = ({ setCurrentPage }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ message: '', error: '', loading: false });

  const updateField = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '', error: '', loading: true });

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setStatus({ message: '', error: 'Passwords do not match.', loading: false });
      return;
    }

    const payload = mode === 'login'
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ message: '', error: data.error || 'Authentication failed.', loading: false });
        return;
      }

      setStatus({ message: data.message || (mode === 'login' ? 'Login successful.' : 'Signup successful.'), error: '', loading: false });

      if (mode === 'login') {
        setTimeout(() => setCurrentPage('home'), 1200);
      } else {
        setMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error) {
      setStatus({ message: '', error: 'Unable to connect to server.', loading: false });
    }
  };

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .auth-page {
          min-height: 100vh;
          background: #f7fafc;
          padding: 4rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .auth-card {
          width: min(520px, 100%);
          background: linear-gradient(180deg, #ffffff, #f7fafc);
          border: 1px solid rgba(14,165,164, 0.08);
          border-radius: 28px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4);
          padding: 2.5rem;
        }

        .auth-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .auth-title {
          color: #fff;
          font-size: 2rem;
          font-weight: 800;
        }

        .auth-switch {
          display: flex;
          gap: 0.5rem;
        }

        .auth-switch button {
          border: none;
          padding: 0.75rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
          color: #c0c0c0;
          background: rgba(255,255,255,0.04);
          transition: all 0.2s ease;
        }

        .auth-switch button.active {
          background: linear-gradient(135deg, #06b6d4, #0ea5a4);
          color: #0f172a;
        }

        .auth-form {
          display: grid;
          gap: 1rem;
        }

        .auth-form label {
          color: #d0d0d0;
          font-size: 0.95rem;
        }

        .auth-form input {
          width: 100%;
          padding: 0.95rem 1rem;
          border-radius: 14px;
          border: 1px solid rgba(14,165,164, 0.08);
          background: #ffffff;
          color: #0f172a;
          font-size: 1rem;
        }

        .auth-form button.submit-btn {
          margin-top: 0.5rem;
          padding: 1rem 1.25rem;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #06b6d4, #0ea5a4);
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-message {
          color: #0ea5a4;
          margin-top: 0.5rem;
          min-height: 1.4rem;
        }

        .auth-error {
          color: #ff7c7c;
        }

        .auth-footer {
          margin-top: 1.5rem;
          color: #b0b0b0;
          font-size: 0.95rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .auth-footer button {
          border: none;
          background: transparent;
          color: #D4AF37;
          cursor: pointer;
          font-weight: 700;
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h1 className="auth-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p style={{ color: '#b0b0b0', marginTop: '0.5rem' }}>
              {mode === 'login'
                ? 'Log in to access your DreamDrive account.'
                : 'Sign up and start browsing premium cars.'}
            </p>
          </div>
          <div className="auth-switch">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
              Sign Up
            </button>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={updateField}
                placeholder="Enter your name"
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={updateField}
              placeholder="name@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={updateField}
              placeholder="Enter a strong password"
              required
            />
          </label>

          {mode === 'signup' && (
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={updateField}
                placeholder="Re-enter your password"
                required
              />
            </label>
          )}

          <button type="submit" className="submit-btn" disabled={status.loading}>
            {status.loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-message">
          {status.error && <span className="auth-error">{status.error}</span>}
          {status.message && <span>{status.message}</span>}
        </div>

        <div className="auth-footer">
          <span>{mode === 'login' ? 'Need an account?' : 'Already have one?'}</span>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== COMPONENTS ===

// Navigation Bar
const Navigation = ({ currentPage, setCurrentPage, cartCount, wishlistCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Collections', page: 'collections' },
    { label: 'About', page: 'about' },
    { label: 'Compare', page: 'compare' },
    { label: 'Contact', page: 'contact' },
    { label: 'Account', page: 'auth' }
  ];

  return (
    <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <style>{`
        .navbar {
          background: linear-gradient(135deg, #f7fafc 0%, #eef2f7 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(14,165,164, 0.08);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5a4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          gap: 3rem;
          list-style: none;
        }

        .nav-link {
          color: #e0e0e0;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link:hover {
          color: #0ea5a4;
        }

        .nav-link.active {
          color: #0ea5a4;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #D4AF37;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-icons {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-icon {
          cursor: pointer;
          position: relative;
          color: #e0e0e0;
          transition: all 0.3s ease;
        }

        .nav-icon:hover {
          color: #D4AF37;
        }

        .badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #0ea5a4;
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .mobile-toggle {
          display: none;
          cursor: pointer;
          color: #D4AF37;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }

        .mobile-menu {
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 1px solid rgba(14,165,164,0.08);
          padding: 1rem;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-menu .nav-link {
          padding: 0.75rem;
          display: block;
          width: 100%;
        }
      `}</style>
      <div className="nav-container">
        <motion.div className="logo" onClick={() => setCurrentPage('home')} whileHover={{ scale: 1.05 }}>
          DREAMDRIVE
        </motion.div>

        <ul className="nav-links">
          {navItems.map(item => (
            <motion.li key={item.page} whileHover={{ scale: 1.05 }}>
              <div
                className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.page)}
              >
                {item.label}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="nav-icons">
          <motion.div className="nav-icon" whileHover={{ scale: 1.2 }} onClick={() => setCurrentPage('wishlist')}>
            <Heart size={24} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </motion.div>
          <motion.div className="nav-icon" whileHover={{ scale: 1.2 }} onClick={() => setCurrentPage('cart')}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </motion.div>
          <motion.div className="mobile-toggle" whileHover={{ scale: 1.2 }} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </div>
      </div>

      {isOpen && (
        <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {navItems.map(item => (
            <div
              key={item.page}
              className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(item.page);
                setIsOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

// Hero Section with Animated Car Showcase
const HeroSection = ({ setCurrentPage }) => {
  const [carIndex, setCarIndex] = useState(0);
  const featuredCars = luxuryCars.filter(car => car.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarIndex(prev => (prev + 1) % featuredCars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredCars.length]);

  return (
    <motion.div className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <style>{`
        .hero {
          height: 100vh;
          background: linear-gradient(135deg, #0B0B0B 0%, #1a0f0f 50%, #0B0B0B 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.03) 50%, transparent 100%);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          width: 100%;
          padding: 4rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .hero-text h1 .highlight {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5a4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 1.2rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 1px;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0B0B0B;
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .hero-btn-secondary {
          background: transparent;
          border: 2px solid #D4AF37;
          color: #D4AF37;
        }

        .hero-btn-secondary:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-3px);
        }

        .car-showcase {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .car-display {
          font-size: 200px;
          position: absolute;
          filter: drop-shadow(0 20px 40px rgba(212, 175, 55, 0.2));
        }

        .car-display img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .car-image-placeholder {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #D4AF37;
          font-size: 4rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .car-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(26, 26, 26, 0.9);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .car-info h3 {
          color: #D4AF37;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .car-specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .spec {
          color: #b0b0b0;
          font-size: 0.9rem;
        }

        .spec-label {
          color: #D4AF37;
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-text h1 {
            font-size: 2.5rem;
          }

          .car-display {
            font-size: 120px;
          }

          .car-showcase {
            height: 300px;
          }
        }
      `}</style>

      <div className="hero-content">
        <motion.div className="hero-text" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h1>
            Experience <span className="highlight">Luxury</span> Redefined
          </h1>
          <p>Discover our curated collection of world's most prestigious automobiles. Buy, compare, or rent your dream car today.</p>
          <div className="hero-buttons">
            <motion.button className="hero-btn hero-btn-primary" onClick={() => setCurrentPage('collections')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Explore Collections <ArrowRight size={18} />
            </motion.button>
            <motion.button className="hero-btn hero-btn-secondary" onClick={() => setCurrentPage('rent')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Rent Now <Calendar size={18} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="car-showcase" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={carIndex}
              className="car-display"
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ duration: 0.8 }}
            >
              {featuredCars[carIndex].image ? (
                <img
                  src={featuredCars[carIndex].image}
                  alt={`${featuredCars[carIndex].brand} ${featuredCars[carIndex].model}`}
                />
              ) : (
                <div className="car-image-placeholder">{featuredCars[carIndex].brand}</div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div className="car-info" layoutId="car-info">
            <h3>{featuredCars[carIndex].brand} {featuredCars[carIndex].model}</h3>
            <p style={{ color: '#D4AF37', fontSize: '1.3rem' }}>₹{featuredCars[carIndex].price.toLocaleString('en-IN')}</p>
            <div className="car-specs">
              <div className="spec">
                <span className="spec-label">0-100 km/h</span>
                {featuredCars[carIndex].acceleration}
              </div>
              <div className="spec">
                <span className="spec-label">Top Speed</span>
                {featuredCars[carIndex].maxSpeed} km/h
              </div>
              <div className="spec">
                <span className="spec-label">Power</span>
                {featuredCars[carIndex].power}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Car Card Component
const CarCard = ({ car, setCurrentPage, onQuickView }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(car.id);

  return (
    <motion.div className="car-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
      <style>{`
        .car-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
          position: relative;
          group: 'card';
        }

        .car-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.15);
          transform: translateY(-5px);
        }

        .car-card-image {
          width: 100%;
          height: 250px;
          background: linear-gradient(135deg, #0B0B0B 0%, #1a0f0f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
          position: relative;
          overflow: hidden;
        }

        .car-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .car-card-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .car-card:hover .car-card-image::after {
          opacity: 1;
        }

        .car-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0B0B0B;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .car-card-content {
          padding: 1.5rem;
        }

        .car-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .car-name h3 {
          color: white;
          font-size: 1.3rem;
          margin: 0;
          margin-bottom: 0.25rem;
        }

        .car-name p {
          color: #D4AF37;
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .wishlist-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #D4AF37;
          transition: all 0.3s ease;
        }

        .wishlist-btn:hover {
          transform: scale(1.2);
        }

        .wishlist-btn.active {
          fill: #D4AF37;
        }

        .car-specs-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #b0b0b0;
          font-size: 0.9rem;
        }

        .spec-item svg {
          color: #D4AF37;
          width: 18px;
          height: 18px;
        }

        .car-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #D4AF37;
          font-weight: 600;
        }

        .car-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .car-price .duration {
          font-size: 0.85rem;
          color: #b0b0b0;
          display: block;
          font-weight: 400;
        }

        .car-card-actions {
          display: flex;
          gap: 0.75rem;
        }

        .car-card-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0B0B0B;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .btn-secondary {
          background: rgba(212, 175, 55, 0.1);
          color: #D4AF37;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(212, 175, 55, 0.2);
        }
      `}</style>

      <div className="car-card-image">
        {car.image ? (
          <img src={car.image} alt={`${car.brand} ${car.model}`} />
        ) : (
          <div className="car-image-placeholder">{car.brand}</div>
        )}
        {car.featured && <div className="car-badge">FEATURED</div>}
      </div>

      <div className="car-card-content">
        <div className="car-card-header">
          <div className="car-name">
            <h3>{car.brand}</h3>
            <p>{car.model}</p>
          </div>
          <motion.button
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={() => inWishlist ? removeFromWishlist(car.id) : addToWishlist(car)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={24} fill={inWishlist ? '#D4AF37' : 'none'} />
          </motion.button>
        </div>

        <div className="car-rating">
          <Star size={18} fill="#D4AF37" />
          <span>{car.rating}</span>
          <span style={{ color: '#b0b0b0' }}>({car.reviews})</span>
        </div>

        <div className="car-specs-mini">
          <div className="spec-item">
            <Zap size={18} /> {car.acceleration}
          </div>
          <div className="spec-item">
            <Fuel size={18} /> {car.power}
          </div>
          <div className="spec-item">
            <Users size={18} /> {car.seats} seats
          </div>
          <div className="spec-item">
            {car.maxSpeed} km/h
          </div>
        </div>

        <div className="car-price">
          ₹{car.price.toLocaleString('en-IN')}
          <span className="duration">or ₹{car.rentalPrice}/day</span>
        </div>

        <div className="car-card-actions">
          <motion.button className="car-card-btn btn-primary" onClick={() => { addToCart(car, 'buy'); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ShoppingCart size={18} /> Buy
          </motion.button>
          <motion.button className="car-card-btn btn-secondary" onClick={() => { addToCart(car, 'rent'); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Calendar size={18} /> Rent
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Collections Page
const CollectionsPage = ({ setCurrentPage }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredCars = luxuryCars.filter(car => {
    const matchesFilter = filter === 'all' || car.brand === filter;
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.featured ? 1 : -1;
  });

  return (
    <motion.div className="collections-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .collections-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .collections-header {
          max-width: 1400px;
          margin: 0 auto 3rem;
        }

        .collections-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, white 0%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .collections-header p {
          font-size: 1.2rem;
          color: #b0b0b0;
          max-width: 600px;
        }

        .filters-container {
          max-width: 1400px;
          margin: 0 auto 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.5rem;
        }

        .filter-group {
          position: relative;
        }

        .filter-label {
          display: block;
          color: #D4AF37;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .filter-input, .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #1A1A1A;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus, .filter-select:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }

        .filter-input::placeholder {
          color: #666;
        }

        .cars-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #b0b0b0;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .filters-container {
            grid-template-columns: 1fr;
          }

          .collections-header h1 {
            font-size: 2.5rem;
          }

          .cars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="collections-header">
        <h1>Luxury Collections</h1>
        <p>Handpicked collection of the world's most prestigious and coveted automobiles</p>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by brand or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Brand</label>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">⬇Sort By</label>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filteredCars.length > 0 ? (
        <div className="cars-grid">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} setCurrentPage={setCurrentPage} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No cars found matching your criteria. Try adjusting your filters!</p>
        </div>
      )}
    </motion.div>
  );
};

// Cart Page
const CartPage = ({ setCurrentPage }) => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);

  const buyItems = cartItems.filter(item => item.type === 'buy');
  const rentItems = cartItems.filter(item => item.type === 'rent');

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateRentalTotal = (items, days = 7) => {
    return items.reduce((total, item) => total + (item.rentalPrice * item.quantity * days), 0);
  };

  const buyTotal = calculateTotal(buyItems);
  const rentalTotal = calculateRentalTotal(rentItems);
  const grandTotal = buyTotal + rentalTotal;

  if (showCheckout && cartItems.length > 0) {
    return (
      <motion.div className="checkout-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <style>{`
          .checkout-page {
            min-height: 100vh;
            background: #0B0B0B;
            padding: 4rem 2rem;
          }

          .checkout-container {
            max-width: 600px;
            margin: 0 auto;
          }

          .success-icon {
            text-align: center;
            font-size: 4rem;
            margin-bottom: 2rem;
            animation: bounce 1s ease-in-out;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          .checkout-form {
            background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(212, 175, 55, 0.1);
            margin-bottom: 2rem;
          }

          .checkout-form h2 {
            color: #D4AF37;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            color: #D4AF37;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }

          .form-group input {
            width: 100%;
            padding: 0.75rem;
            background: #0B0B0B;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 10px;
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .form-group input:focus {
            outline: none;
            border-color: #D4AF37;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .order-summary {
            background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(212, 175, 55, 0.1);
            margin-bottom: 2rem;
          }

          .order-summary h3 {
            color: #D4AF37;
            margin-bottom: 1rem;
          }

          .order-item {
            display: flex;
            justify-content: space-between;
            color: #b0b0b0;
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
          }

          .order-item.total {
            border-top: 1px solid rgba(212, 175, 55, 0.1);
            padding-top: 0.75rem;
            color: #D4AF37;
            font-weight: 700;
            font-size: 1.2rem;
          }

          .checkout-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
            color: #0B0B0B;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
          }

          .checkout-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
          }

          .back-btn {
            width: 100%;
            padding: 1rem;
            background: transparent;
            color: #D4AF37;
            border: 2px solid #D4AF37;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-btn:hover {
            background: rgba(212, 175, 55, 0.1);
          }
        `}</style>

        <div className="checkout-container">
          <motion.div className="success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            Success
          </motion.div>

          <motion.h1 style={{ textAlign: 'center', color: 'white', marginBottom: '1rem', fontSize: '2.5rem' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            Order Summary
          </motion.h1>

          <motion.div className="order-summary" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3>Items Summary</h3>
            {buyItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.brand} {item.model} (Buy)</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {rentItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.brand} {item.model} (Rent - 7 days)</span>
                <span>₹{(item.rentalPrice * item.quantity * 7).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="order-item total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </motion.div>

          <motion.form className="checkout-form" onSubmit={(e) => {
            e.preventDefault();
            alert('Payment successful! Your order has been confirmed. Thank you for choosing DreamDrive!');
            setShowCheckout(false);
            setCurrentPage('home');
          }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2>Payment Details</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="Enter your address" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" required />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" maxLength="3" required />
              </div>
            </div>
            <motion.button type="submit" className="checkout-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Complete Payment
            </motion.button>
            <motion.button type="button" className="back-btn" onClick={() => setShowCheckout(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Back to Cart
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="cart-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .cart-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 3rem;
        }

        .cart-header h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .cart-items {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .cart-section-title {
          color: #D4AF37;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 1px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          background: #0B0B0B;
          border-radius: 15px;
          margin-bottom: 1rem;
          border: 1px solid rgba(212, 175, 55, 0.05);
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          border-color: rgba(212, 175, 55, 0.2);
          background: #151515;
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #0B0B0B 0%, #1a0f0f 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .cart-item-details h4 {
          color: white;
          margin: 0 0 0.25rem 0;
        }

        .cart-item-details p {
          color: #b0b0b0;
          margin: 0;
          font-size: 0.95rem;
        }

        .cart-item-type {
          color: #D4AF37;
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: right;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #0B0B0B;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          padding: 0.25rem;
        }

        .quantity-btn {
          background: none;
          border: none;
          color: #D4AF37;
          cursor: pointer;
          padding: 0.35rem 0.7rem;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .quantity-display {
          color: white;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ff6b6b;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          color: #ff8787;
          transform: scale(1.1);
        }

        .item-price {
          color: #D4AF37;
          font-weight: 700;
          font-size: 1.1rem;
          min-width: 120px;
          text-align: right;
        }

        .cart-summary {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          color: #b0b0b0;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .summary-divider {
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          margin: 1rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          color: #D4AF37;
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
        }

        .checkout-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0B0B0B;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .checkout-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .continue-shopping {
          width: 100%;
          padding: 1rem;
          background: transparent;
          color: #D4AF37;
          border: 2px solid #D4AF37;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-shopping:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          color: #b0b0b0;
        }

        .empty-cart svg {
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
          }

          .cart-item-actions {
            grid-column: 2;
            justify-content: space-between;
            margin-top: 1rem;
          }

          .item-price {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <motion.div className="cart-items" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="empty-cart">
              <ShoppingCart strokeWidth={1} />
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your cart is empty</p>
              <motion.button
                className="continue-shopping"
                onClick={() => setCurrentPage('collections')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {buyItems.length > 0 && (
                <div>
                  <div className="cart-section-title">🛍️ Purchase Items</div>
                  {buyItems.map(item => (
                    <motion.div key={item.id} className="cart-item" layout>
                      <div className="cart-item-image">{item.image}</div>
                      <div>
                        <h4>{item.brand} {item.model}</h4>
                        <p>{item.year} • {item.color}</p>
                        <div className="cart-item-type">Purchase</div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'buy', item.quantity - 1)}>
                            <Minus size={16} />
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'buy', item.quantity + 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id, 'buy')}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {rentItems.length > 0 && (
                <div style={{ marginTop: buyItems.length > 0 ? '2rem' : 0 }}>
                  <div className="cart-section-title">🚗 Rental Items (7 Days)</div>
                  {rentItems.map(item => (
                    <motion.div key={item.id} className="cart-item" layout>
                      <div className="cart-item-image">{item.image}</div>
                      <div>
                        <h4>{item.brand} {item.model}</h4>
                        <p>₹{item.rentalPrice}/day • {item.seats} seats</p>
                        <div className="cart-item-type">Rental (7 Days)</div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'rent', item.quantity - 1)}>
                            <Minus size={16} />
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'rent', item.quantity + 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="item-price">₹{(item.rentalPrice * item.quantity * 7).toLocaleString('en-IN')}</div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id, 'rent')}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <motion.div className="cart-summary" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h3 style={{ color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Order Summary</h3>
              {buyItems.length > 0 && (
                <div className="summary-item">
                  <span>Purchase Subtotal</span>
                  <span>₹{buyTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {rentItems.length > 0 && (
                <div className="summary-item">
                  <span>Rental Subtotal (7 days)</span>
                  <span>₹{rentalTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-item">
                <span>Taxes & Fees</span>
                <span>₹{Math.round(grandTotal * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>₹{(grandTotal + Math.round(grandTotal * 0.18)).toLocaleString('en-IN')}</span>
              </div>
              <motion.button className="checkout-button" onClick={() => setShowCheckout(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Proceed to Checkout
              </motion.button>
              <motion.button className="continue-shopping" onClick={() => setCurrentPage('collections')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Wishlist Page
const WishlistPage = ({ setCurrentPage }) => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <motion.div className="wishlist-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .wishlist-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .wishlist-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .wishlist-header {
          margin-bottom: 3rem;
        }

        .wishlist-header h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .empty-wishlist {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          color: #b0b0b0;
        }

        .empty-wishlist svg {
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }
      `}</style>

      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>❤️ My Wishlist</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</p>
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div className="empty-wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Heart strokeWidth={1} style={{ margin: '0 auto' }} />
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your wishlist is empty</p>
            <motion.button
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%)',
                color: '#0B0B0B',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setCurrentPage('collections')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Cars
            </motion.button>
          </motion.div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(car => (
              <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} layout>
                <CarCard car={car} setCurrentPage={setCurrentPage} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <motion.div className="about-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .about-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .about-hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-hero p {
          font-size: 1.2rem;
          color: #b0b0b0;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .about-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .about-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.15);
        }

        .about-card h3 {
          color: #D4AF37;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .about-card p {
          color: #b0b0b0;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #b0b0b0;
          font-size: 1rem;
        }

        .testimonials {
          margin-top: 4rem;
        }

        .testimonials h2 {
          color: white;
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .testimonial {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .testimonial-text {
          color: #b0b0b0;
          margin-bottom: 1rem;
          line-height: 1.6;
          font-style: italic;
        }

        .testimonial-author {
          color: #D4AF37;
          font-weight: 600;
        }

        .testimonial-rating {
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="about-container">
        <motion.div className="about-hero" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1>About DreamDrive</h1>
          <p>Your premier destination for luxury automobile experiences. We curate the world's most prestigious vehicles for discerning clients who demand excellence.</p>
        </motion.div>

        <motion.div className="about-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {[
            { title: '🎯 Our Mission', desc: 'To democratize access to luxury vehicles and create unforgettable driving experiences for automotive enthusiasts.' },
            { title: '💎 Our Promise', desc: 'Premium quality, transparent pricing, and exceptional customer service in every interaction.' },
            { title: '🌍 Our Vision', desc: 'To become the world\'s most trusted luxury car marketplace, setting industry standards.' }
          ].map((item, i) => (
            <motion.div key={i} className="about-card" whileHover={{ scale: 1.05 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="stats-grid" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {[
            { number: '8', label: 'Premium Brands' },
            { number: '50+', label: 'Luxury Vehicles' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '24/7', label: 'Customer Support' }
          ].map((stat, i) => (
            <motion.div key={i} className="stat" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <h2>Customer Reviews</h2>
          <div className="testimonials-grid">
            {reviews.map((review, i) => (
              <motion.div key={i} className="testimonial" whileHover={{ scale: 1.05 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 + i * 0.1 }}>
                <div className="testimonial-rating">
                  {'⭐'.repeat(review.rating)}
                </div>
                <p className="testimonial-text">"{review.text}"</p>
                <div className="testimonial-author">- {review.author}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Compare Page
const ComparePage = () => {
  const [selectedCars, setSelectedCars] = useState([luxuryCars[0], luxuryCars[1]]);

  return (
    <motion.div className="compare-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .compare-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .compare-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .compare-header {
          margin-bottom: 3rem;
        }

        .compare-header h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .compare-selectors {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .selector-group {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .selector-group label {
          display: block;
          color: #D4AF37;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: 1px;
        }

        .selector-group select {
          width: 100%;
          padding: 0.75rem;
          background: #0B0B0B;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .selector-group select:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }

        .comparison-table {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.1);
          margin-bottom: 2rem;
        }

        .table-header {
          display: grid;
          grid-template-columns: 200px 1fr 1fr;
          gap: 0;
          background: rgba(212, 175, 55, 0.05);
          border-bottom: 2px solid rgba(212, 175, 55, 0.1);
        }

        .table-header-cell {
          padding: 1.5rem;
          color: #D4AF37;
          font-weight: 700;
          text-align: center;
          border-right: 1px solid rgba(212, 175, 55, 0.1);
        }

        .table-header-cell:last-child {
          border-right: none;
        }

        .table-row {
          display: grid;
          grid-template-columns: 200px 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.05);
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-label {
          padding: 1.5rem;
          color: #b0b0b0;
          font-weight: 600;
          border-right: 1px solid rgba(212, 175, 55, 0.05);
          background: rgba(0, 0, 0, 0.2);
        }

        .table-value {
          padding: 1.5rem;
          color: white;
          text-align: center;
          border-right: 1px solid rgba(212, 175, 55, 0.05);
        }

        .table-value.better {
          background: rgba(212, 175, 55, 0.08);
          color: #D4AF37;
          font-weight: 600;
        }

        .table-value:last-child {
          border-right: none;
        }

        .car-image-section {
          text-align: center;
          padding: 2rem;
          font-size: 100px;
        }

        .car-image-section img {
          max-width: 180px;
          width: 100%;
          height: auto;
          border-radius: 15px;
        }

        @media (max-width: 768px) {
          .compare-selectors {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }

          .table-header-cell,
          .table-label,
          .table-value {
            border-right: none;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          }

          .table-header-cell:last-child,
          .table-value:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      <div className="compare-container">
        <div className="compare-header">
          <h1>⚖️ Compare Cars</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>Side-by-side comparison of luxury vehicles</p>
        </div>

        <motion.div className="compare-selectors" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {[0, 1].map(i => (
            <motion.div key={i} className="selector-group" whileHover={{ scale: 1.02 }}>
              <label>Car {i + 1}</label>
              <select value={selectedCars[i]?.id} onChange={(e) => {
                const newCars = [...selectedCars];
                newCars[i] = luxuryCars.find(c => c.id === parseInt(e.target.value));
                setSelectedCars(newCars);
              }}>
                {luxuryCars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="comparison-table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="table-header">
            <div className="table-header-cell">Specification</div>
            {selectedCars.map(car => (
              <div key={car?.id} className="table-header-cell">
                {car?.brand} {car?.model}
              </div>
            ))}
          </div>

          {['Image', 'Year', 'Price', 'Acceleration', 'Top Speed', 'Power', 'Fuel Type', 'Seats', 'Rating'].map((spec, idx) => {
            const getValue = (car) => {
              switch (spec) {
                case 'Image': return car.image;
                case 'Year': return car.year;
                case 'Price': return `₹${car.price.toLocaleString('en-IN')}`;
                case 'Acceleration': return car.acceleration;
                case 'Top Speed': return `${car.maxSpeed} km/h`;
                case 'Power': return car.power;
                case 'Fuel Type': return car.fuel;
                case 'Seats': return car.seats;
                case 'Rating': return `⭐ ${car.rating}`;
                default: return '';
              }
            };

            const isBetter = (car1, car2) => {
              if (spec === 'Price') return car1.price < car2.price;
              if (spec === 'Acceleration') return parseFloat(car1.acceleration) < parseFloat(car2.acceleration);
              if (spec === 'Top Speed') return parseInt(car1.maxSpeed) > parseInt(car2.maxSpeed);
              if (spec === 'Power') return parseInt(car1.power) > parseInt(car2.power);
              if (spec === 'Seats') return car1.seats > car2.seats;
              if (spec === 'Rating') return car1.rating > car2.rating;
              return false;
            };

            return (
              <div key={spec} className="table-row">
                <div className="table-label">{spec}</div>
                {selectedCars.map((car, cidx) => (
                  <div
                    key={car?.id}
                    className={`table-value ${spec !== 'Image' && isBetter(car, selectedCars[1 - cidx]) ? 'better' : ''}`}
                  >
                    {spec === 'Image' ? (
                      <div className="car-image-section">
                        {car.image ? (
                          <img src={car.image} alt={`${car.brand} ${car.model}`} />
                        ) : (
                          car.brand
                        )}
                      </div>
                    ) : (
                      getValue(car)
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Contact Page
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  return (
    <motion.div className="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .contact-page {
          min-height: 100vh;
          background: #0B0B0B;
          padding: 4rem 2rem;
        }

        .contact-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-header h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-form {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #D4AF37;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #0B0B0B;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }

        .form-group textarea {
          min-height: 150px;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
          color: #0B0B0B;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .info-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #242424 100%);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
        }

        .info-card h3 {
          color: #D4AF37;
          margin-bottom: 0.75rem;
        }

        .info-card p {
          color: #b0b0b0;
        }
      `}</style>

      <div className="contact-container">
        <motion.div className="contact-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Get in Touch</h1>
          <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>Have questions? We'd love to hear from you!</p>
        </motion.div>

        <motion.form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for contacting DreamDrive! We\'ll get back to you soon.'); setFormData({ name: '', email: '', message: '' }); }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Tell us about your inquiry..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Send Message
          </motion.button>
        </motion.form>

        <motion.div className="contact-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {[
            { title: '📞 Phone', text: '+91-9876-543-210' },
            { title: '📧 Email', text: 'hello@dreamdrive.com' },
            { title: '📍 Location', text: 'Ahmedabad, India' }
          ].map((item, i) => (
            <motion.div key={i} className="info-card" whileHover={{ scale: 1.05 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Footer
const Footer = ({ setCurrentPage }) => {
  return (
    <footer style={styles.footer}>
      <style>{`
        ${styles.footerCss}
      `}</style>
      <div className="footer-content">
        <motion.div className="footer-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3>🏎️ DREAMDRIVE</h3>
          <p>Your premier luxury car marketplace</p>
        </motion.div>

        <motion.div className="footer-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <h4>Quick Links</h4>
          <ul>
            <li><a onClick={() => setCurrentPage('home')}>Home</a></li>
            <li><a onClick={() => setCurrentPage('collections')}>Collections</a></li>
            <li><a onClick={() => setCurrentPage('about')}>About</a></li>
            <li><a onClick={() => setCurrentPage('contact')}>Contact</a></li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <h4>Services</h4>
          <ul>
            <li><a>Buy Cars</a></li>
            <li><a>Rent Cars</a></li>
            <li><a>Compare</a></li>
            <li><a>Wishlist</a></li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <h4>Follow Us</h4>
          <ul style={{ display: 'flex', gap: '1rem' }}>
            <li><a>Facebook</a></li>
            <li><a>Instagram</a></li>
            <li><a>Twitter</a></li>
            <li><a>LinkedIn</a></li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer-bottom" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p>&copy; 2024 DreamDrive. All rights reserved. | Designed with ❤️ for luxury car enthusiasts</p>
      </motion.div>
    </footer>
  );
};

// Styles
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #0B0B0B 0%, #1a0f0f 100%)',
    borderTop: '1px solid rgba(212, 175, 55, 0.1)',
    padding: '3rem 2rem 1rem',
    marginTop: '4rem'
  },
  footerCss: `
    .footer-content {
      max-width: 1400px;
      margin: 0 auto 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .footer-section h3 {
      background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .footer-section h4 {
      color: #D4AF37;
      margin-bottom: 1rem;
      letter-spacing: 1px;
    }

    .footer-section p {
      color: #b0b0b0;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.75rem;
    }

    .footer-section ul li a {
      color: #b0b0b0;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .footer-section ul li a:hover {
      color: #D4AF37;
      transform: translateX(5px);
    }

    .footer-bottom {
      max-width: 1400px;
      margin: 0 auto;
      text-align: center;
      color: #666;
      border-top: 1px solid rgba(212, 175, 55, 0.1);
      padding-top: 2rem;
      font-size: 0.9rem;
    }
  `
};

// ==================== MAIN APP ====================
export default function DreamDrive() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <CartProvider onCountChange={setCartCount}>
      <WishlistProvider onCountChange={setWishlistCount}>
        <div style={{ background: '#0B0B0B', color: 'white', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cartCount} wishlistCount={wishlistCount} />

          <AnimatePresence mode="wait">
            {currentPage === 'home' && <HeroSection setCurrentPage={setCurrentPage} key="home" />}
            {currentPage === 'collections' && <CollectionsPage setCurrentPage={setCurrentPage} key="collections" />}
            {currentPage === 'cart' && <CartPage setCurrentPage={setCurrentPage} key="cart" />}
            {currentPage === 'wishlist' && <WishlistPage setCurrentPage={setCurrentPage} key="wishlist" />}
            {currentPage === 'about' && <AboutPage key="about" />}
            {currentPage === 'compare' && <ComparePage key="compare" />}
            {currentPage === 'contact' && <ContactPage key="contact" />}
            {currentPage === 'auth' && <AuthPage setCurrentPage={setCurrentPage} key="auth" />}
          </AnimatePresence>

          <Footer setCurrentPage={setCurrentPage} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}