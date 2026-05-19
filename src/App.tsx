import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Trophy, 
  Clock, 
  Brain, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Flame,
  Globe,
  Plus,
  Moon,
  Sun,
  Github,
  Twitter,
  Zap,
  Shield,
  Layout,
  Target,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  FileText,
  Users,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import questionsData from './data/questions.json';
import { Question, LeaderboardEntry } from './types';
import { API_BASE_URL } from './config';

// --- Theme Management ---
const useTheme = () => {
  const theme = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return { theme };
};

// --- Typing Animation Component ---
const TypingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span style={{ 
      background: 'linear-gradient(90deg, #0070f3, #f81ce5)', 
      WebkitBackgroundClip: 'text', 
      WebkitTextFillColor: 'transparent',
      borderRight: '3px solid var(--primary)',
      paddingRight: '5px'
    }}>
      {words[index].substring(0, subIndex)}
    </span>
  );
};

import { StatCounter, BouncingTitle } from './components/AnimatedComponents';

// --- Colorful Blob Component ---
const ColorBlobs = () => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2, pointerEvents: 'none', overflow: 'hidden' }}>
    <div className="blob" style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'rgba(0, 112, 243, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
    <div className="blob" style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(255, 0, 128, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
    <div className="blob" style={{ position: 'absolute', top: '40%', left: '60%', width: '300px', height: '300px', background: 'rgba(121, 40, 202, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
  </div>
);

// --- Infinite Marquee Component ---
const InfiniteMarquee = () => {
  const categories = [
    { name: "General Knowledge", color: "#0070f3", icon: <Globe size={18} /> },
    { name: "Computer Science", color: "#7928ca", icon: <Brain size={18} /> },
    { name: "Mathematics", color: "#ff0080", icon: <Plus size={18} /> },
    { name: "Chemistry", color: "#f5a623", icon: <Flame size={18} /> },
    { name: "Physics", color: "#50e3c2", icon: <Trophy size={18} /> }
  ];

  const MarqueeRow = ({ items, reverse = false }: { items: any[], reverse?: boolean }) => (
    <div className="marquee-container" style={{ overflow: 'hidden', padding: '20px 0', width: '100%', position: 'relative' }}>
      <motion.div 
        className="marquee-content"
        animate={{ x: reverse ? [0, -2000] : [-2000, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ display: 'flex', gap: '40px', width: 'max-content' }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {[...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, borderColor: item.color }}
            className="card"
            style={{ 
              padding: '16px 32px', 
              borderRadius: '100px', 
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              border: `1px solid var(--border)`,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ color: item.color, display: 'flex', alignItems: 'center' }}>{item.icon}</div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="section" style={{ overflow: 'hidden', padding: '100px 0', borderBottom: 'none' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <BouncingTitle text="Our Course Catalog" style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' }} />
      </div>
      <MarqueeRow items={categories} />
      <MarqueeRow items={categories} reverse={true} />
    </section>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const username = localStorage.getItem('username');
  const { pathname } = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  return (
    <nav className={isOpen ? 'nav-open' : ''}>
      <div className="container">
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1001 }}>
          <Brain size={24} strokeWidth={3} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>QUIZ</span>
        </Link>

        <button 
          className="nav-mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', zIndex: 1001 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/groups" className="nav-link">Study Groups</Link>
          <Link to="/survey" className="nav-link">Survey</Link>

          {username ? (
            <div className="nav-user-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 600 }}>Welcome, {username}</span>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>My Dashboard</Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('username');
                  window.location.href = '/login';
                }} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', marginBottom: '60px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Brain size={24} strokeWidth={3} color="var(--success)" />
            <span style={{ fontWeight: 800 }}>QUIZ</span>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Empowering university students with the tools to master their courses and dominate every exam.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontWeight: 800 }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link to="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>Course Categories</Link>
            <Link to="/leaderboard" style={{ color: 'inherit', textDecoration: 'none' }}>Leaderboard</Link>
            <Link to="/groups" style={{ color: 'inherit', textDecoration: 'none' }}>Study Groups</Link>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontWeight: 800 }}>Resources</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link to="/survey" style={{ color: 'inherit', textDecoration: 'none' }}>Support Center</Link>
            <span style={{ cursor: 'pointer' }}>API Documentation</span>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontWeight: 800 }}>Connect</h4>
          <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)' }}>
            <a href="https://github.com/apreezofficial" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><Github size={24} /></a>
            <Twitter size={24} />
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <span>© 2026 Quiz Inc. Developed with passion for students.</span>
        <div style={{ display: 'flex', gap: '30px' }}>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });

      // Bouncing button animation
      gsap.to(".btn-bounce", {
        y: -10,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }} ref={heroRef}>
      <ColorBlobs />
      
      {/* Hero Section */}
      <section className="section grid-bg" style={{ textAlign: 'center', padding: '180px 0 140px', borderBottom: 'none' }}>
        <div className="container">
          <div>
            <BouncingTitle 
              text="Build and master on the Knowledge Cloud." 
              style={{ fontSize: '5.5rem', letterSpacing: '-0.06em', lineHeight: '1.1', marginBottom: '32px', fontWeight: 800, textAlign: 'center' }} 
            />
            <p className="gsap-reveal" style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 50px', lineHeight: '1.7' }}>
              The ultimate platform for university students to challenge their knowledge, track their progress, and dominate their exams.
            </p>
            <div className="gsap-reveal" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/categories')} 
                className="btn btn-primary btn-bounce" 
                style={{ padding: '16px 48px', fontSize: '1.1rem' }}
              >
                Start Learning
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Slide Animation */}
      <section className="section" style={{ background: 'var(--accents-1)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', gap: '40px' }}>
            {[
              { label: 'Total Questions', value: 300, suffix: '+', color: '#0070f3' },
              { label: 'Quiz Categories', value: 5, suffix: '', color: '#f81ce5' },
              { label: 'Avg. Accuracy', value: 78, suffix: '%', color: '#00dfd8' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                whileInView={{ opacity: 1, x: 0 }} 
                initial={{ opacity: 0, x: -30 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <h2 style={{ fontSize: '3.5rem', marginBottom: '10px', color: stat.color, fontWeight: 800 }}>
                  <StatCounter end={stat.value} suffix={stat.suffix} />
                </h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.15em' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InfiniteMarquee />

      {/* What We Solve Section */}
      <section className="section" style={{ background: 'var(--accents-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <BouncingTitle text="What We Solve." style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 800, textAlign: 'center' }} />
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>We turn study struggles into academic success.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {[
              { title: "Last-Minute Panic", solve: "Stop cramming blindly. Quickly test your knowledge before exams to find and fix your weak spots instantly.", color: "#0070f3" },
              { title: "Boring Study Sessions", solve: "Textbooks are dry. Our interactive quizzes turn passive reading into active, engaging learning that actually sticks.", color: "#f81ce5" },
              { title: "Uncertain Progress", solve: "No more guessing your grades. Know exactly which topics you've mastered and where you need more focus.", color: "#00dfd8" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="card"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '40px', borderTop: `4px solid ${item.color}` }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.solve}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <BouncingTitle text="Built for Better Learning." style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 800, textAlign: 'center' }} />
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Simple, fast, and designed to help you ace your university exams.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Zap size={32} color="#f5a623" />, title: "Instant Results", desc: "See your score and detailed corrections the moment you finish your quiz.", border: "#f5a623" },
              { icon: <Shield size={32} color="#0070f3" />, title: "Progress History", desc: "Every quiz you take is saved. Track your improvement over the semester.", border: "#0070f3" },
              { icon: <Layout size={32} color="#7928ca" />, title: "Study Anywhere", desc: "Access your quizzes on your phone during a commute or on your laptop in class.", border: "#7928ca" },
              { icon: <Target size={32} color="#ff0080" />, title: "Course Mastery", desc: "Focus on what matters with quizzes categorized by your specific subjects.", border: "#ff0080" }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                className="card"
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -10, 
                  borderColor: feat.border,
                  boxShadow: `0 20px 40px -20px ${feat.border}40`,
                  background: `linear-gradient(135deg, var(--bg-color) 0%, ${feat.border}05 100%)`
                }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ 
                  position: 'relative', 
                  overflow: 'hidden', 
                  padding: '40px', 
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: `${feat.border}15`, 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ marginBottom: '12px', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ position: 'relative', background: 'var(--bg-color)', borderBottom: 'none', paddingBottom: '120px' }}>
        <div className="container">
          <motion.div 
            whileInView={{ scale: 1, opacity: 1 }}
            initial={{ scale: 0.95, opacity: 0 }}
            viewport={{ once: true }}
            className="card" 
            style={{ 
              background: 'var(--success)', 
              color: '#fff', 
              textAlign: 'center', 
              padding: '100px 40px', 
              borderRadius: '40px', 
              position: 'relative', 
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 40px 100px -30px rgba(0, 112, 243, 0.5)'
            }}
          >
             {/* Pattern Overlay */}
             <div style={{ 
               position: 'absolute', 
               top: 0, left: 0, width: '100%', height: '100%', 
               backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
               backgroundSize: '32px 32px',
               pointerEvents: 'none' 
             }}></div>

             <BouncingTitle text="Ready to Crush Your Next Exam?" style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-0.04em', fontWeight: 800, textAlign: 'center', color: '#fff' }} />
             <p style={{ opacity: 0.9, fontSize: '1.3rem', marginBottom: '40px', maxWidth: '650px', margin: '0 auto', fontWeight: 500, lineHeight: '1.6' }}>
               Join thousands of students mastering their courses and acing their tests with our advanced assessment tools.
             </p>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => navigate('/categories')} 
               className="btn" 
               style={{ background: '#fff', color: 'var(--success)', padding: '20px 60px', fontWeight: 800, fontSize: '1.2rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
             >
               Get Started Now
             </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// --- Logic Pages ---

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [timeLimit, setTimeLimit] = useState(10); // minutes
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCat]);

  const CATEGORIES = [
    { id: 'general_knowledge', name: 'General Knowledge', icon: <Globe size={24} />, color: "#0070f3" },
    { id: 'computer_science', name: 'Computer Science', icon: <Brain size={24} />, color: "#7928ca" },
    { id: 'mathematics', name: 'Mathematics', icon: <Plus size={24} />, color: "#ff0080" },
    { id: 'chemistry', name: 'Chemistry', icon: <Flame size={24} />, color: "#f5a623" },
    { id: 'physics', name: 'Physics', icon: <Trophy size={24} />, color: "#50e3c2" },
  ];

  return (
    <div className="container" style={{ padding: '80px 0' }}>
      {!selectedCat ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <BouncingTitle text="Categories" style={{ fontSize: '3.5rem', marginBottom: '50px', letterSpacing: '-0.04em', fontWeight: 800 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -8, borderColor: cat.color }}
                onClick={() => setSelectedCat(cat.id)}
                className="card"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '24px', padding: '40px' }}
              >
                <div style={{ padding: '16px', background: `${cat.color}15`, color: cat.color, borderRadius: '12px' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center', padding: '60px' }}>
          <BouncingTitle text="Quiz Settings" style={{ marginBottom: '32px', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' }} />
          
          <div style={{ marginBottom: '40px' }}>
            <p style={{ marginBottom: '16px', fontWeight: 700, color: 'var(--text-muted)' }}>DIFFICULTY</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {(['easy', 'medium', 'hard'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className="btn"
                  style={{ 
                    background: difficulty === lvl ? 'var(--primary)' : 'transparent',
                    color: difficulty === lvl ? 'var(--bg-color)' : 'var(--text-main)',
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    padding: '10px 24px'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <p style={{ marginBottom: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TIME LIMIT (MINS)</p>
              <input 
                type="number" 
                value={timeLimit} 
                onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--accents-1)', color: 'var(--text-main)', textAlign: 'center', fontWeight: 700 }}
              />
            </div>
            <div>
              <p style={{ marginBottom: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>QUESTIONS</p>
              <input 
                type="number" 
                value={questionCount} 
                onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--accents-1)', color: 'var(--text-main)', textAlign: 'center', fontWeight: 700 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={() => setSelectedCat(null)} className="btn btn-secondary" style={{ padding: '14px 40px' }}>Back</button>
            <button 
              onClick={() => navigate(`/quiz/${selectedCat}/${difficulty}`, { state: { timeLimit, questionCount } })} 
              className="btn btn-primary" 
              style={{ padding: '14px 40px', background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}
            >
              Start Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const QuizPage = () => {
  const { categoryId, difficulty } = useParams<{ categoryId: string, difficulty: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { timeLimit = 10, questionCount = 10 } = (location.state as any) || {};
  
  const questions = useMemo(() => {
    const all = (questionsData as Question[]).filter(q => q.category === categoryId && q.difficulty === difficulty);
    return all.sort(() => Math.random() - 0.5).slice(0, questionCount);
  }, [categoryId, difficulty, questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{questionId: number, isCorrect: boolean, selected: string}[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    if (timeLeft <= 0) { finishQuiz(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const existingAnswer = answers.find(a => a.questionId === questions[currentIndex]?.id);
    setSelectedOption(existingAnswer ? existingAnswer.selected : null);
  }, [currentIndex, questions, answers]);

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    const newAnswer = { questionId: currentQuestion.id, isCorrect, selected: selectedOption! };
    const existingIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    const updatedAnswers = existingIndex !== -1 ? [...answers] : [...answers, newAnswer];
    if (existingIndex !== -1) updatedAnswers[existingIndex] = newAnswer;
    setAnswers(updatedAnswers);
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else finishQuiz(updatedAnswers);
  };

  const handlePrevious = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const finishQuiz = (finalAnswers = answers) => {
    const score = finalAnswers.filter(a => a.isCorrect).length;
    navigate('/results', { state: { score, total: questions.length, answers: finalAnswers, categoryId } });
  };

  if (!questions.length) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>No questions found for this category and difficulty.</div>;

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '650px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accents-1)', padding: '8px 20px', borderRadius: '100px', border: '1px solid var(--border)' }}>
            <Clock size={20} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Question {currentIndex + 1} of {questions.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex} 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="card" 
          style={{ padding: '40px', borderRadius: '24px' }}
        >
          <h2 style={{ fontSize: '1.75rem', marginBottom: '32px', fontWeight: 800, lineHeight: '1.4' }}>{questions[currentIndex].question}</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {questions[currentIndex].options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedOption(opt)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: selectedOption === opt ? 'var(--primary)' : 'var(--border)',
                  background: selectedOption === opt ? 'var(--primary)' : 'transparent',
                  color: selectedOption === opt ? 'var(--bg-color)' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn btn-secondary" style={{ padding: '10px 24px' }}>Previous</button>
            <button onClick={handleNext} disabled={!selectedOption} className="btn btn-primary" style={{ padding: '10px 24px', background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}>
              {currentIndex === questions.length - 1 ? 'Finish Challenge' : 'Continue'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ResultsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { score, total, answers } = state || { score: 0, total: 0, answers: [] };

  useEffect(() => { 
    if (score / total >= 0.7) confetti({ colors: ['#0070f3', '#f81ce5', '#00dfd8'] }); 
    
    // Save progress to PHP backend
    const saveScore = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/save_score.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: localStorage.getItem('username') || 'Guest_' + Math.floor(Math.random() * 1000),
            score: score * 10, // Scale score for leaderboard
            category: state?.categoryId || 'General',
            rarity: score / total >= 0.8 ? 'Elite' : 'Pro'
          })
        });
      } catch (err) {
        console.error("Failed to save score", err);
      }
    };
    saveScore();
  }, []);

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '650px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: '60px 40px', textAlign: 'center', marginBottom: '40px', borderTop: '8px solid var(--success)', borderRadius: '24px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '8px', fontWeight: 900 }}>{Math.round((score/total)*100)}%</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', fontWeight: 500 }}>Challenge Mastered: {score} / {total} correct answers.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/categories')} className="btn btn-primary" style={{ padding: '12px 32px' }}>New Challenge</button>
          <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ padding: '12px 32px' }}>Return Home</button>
        </div>
      </motion.div>
      <div style={{ display: 'grid', gap: '20px' }}>
        {answers.map((ans: any, i: number) => {
          const questionObj = (questionsData as Question[]).find(q => q.id === ans.questionId);
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="card" 
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', borderRadius: '16px' }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ color: ans.isCorrect ? 'var(--success)' : 'var(--error)', marginTop: '4px' }}>
                  {ans.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: !ans.isCorrect ? '12px' : '0', lineHeight: '1.4' }}>{questionObj?.question}</p>
                  {!ans.isCorrect && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ padding: '12px 16px', background: 'var(--accents-1)', borderRadius: '12px', borderLeft: '4px solid var(--success)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>CORRECT ANSWER</span>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>{questionObj?.answer}</span>
                      </div>
                      <div style={{ padding: '12px 16px', background: 'rgba(238, 0, 0, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--error)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>YOUR ANSWER</span>
                        <span style={{ fontWeight: 700, color: 'var(--error)' }}>{ans.selected}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get_leaderboard.php`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Group by user and take highest score
          const uniqueLeaders: Record<string, LeaderboardEntry> = {};
          data.forEach(entry => {
            if (!uniqueLeaders[entry.username] || entry.score > uniqueLeaders[entry.username].score) {
              uniqueLeaders[entry.username] = entry;
            }
          });
          const sorted = Object.values(uniqueLeaders).sort((a, b) => b.score - a.score);
          setLeaderboard(sorted);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Leaderboard fetch failed", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container" style={{ padding: '80px 0' }}>Loading high scores...</div>;

  return (
    <div className="container" style={{ padding: '80px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '50px' }}>
        <BouncingTitle text="Leaderboard" style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.05em', textAlign: 'center' }} />
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--accents-1)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '30px', textAlign: 'left', fontWeight: 800 }}>Rank</th>
              <th style={{ padding: '30px', textAlign: 'left', fontWeight: 800 }}>User</th>
              <th style={{ padding: '30px', textAlign: 'right', fontWeight: 800 }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }} className="table-row-hover">
                <td style={{ padding: '30px', fontWeight: 900, fontSize: '1.2rem' }}>#{i + 1}</td>
                <td style={{ padding: '30px', fontWeight: 600 }}>{entry.username}</td>
                <td style={{ padding: '30px', textAlign: 'right', fontWeight: 900, color: '#0070f3', fontSize: '1.2rem' }}>{entry.score} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const SurveyPage = () => (
  <div className="container" style={{ padding: '80px 0' }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '60px' }}>
      <BouncingTitle text="Project Development Insights" style={{ fontSize: '3rem', marginBottom: '60px', fontWeight: 900, textAlign: 'center' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {[
          { 
            title: "Why did you take the quiz?", 
            color: "#0070f3",
            options: [{ label: "Self Improvement", v: 85 }, { label: "Casual Fun", v: 60 }, { label: "Professional Challenge", v: 45 }] 
          },
          { 
            title: "Which kind of quiz interests you?", 
            color: "#7928ca",
            options: [{ label: "Science & Tech", v: 90 }, { label: "Creative Arts", v: 40 }, { label: "History & Culture", v: 65 }] 
          },
          { 
            title: "User Age Range", 
            color: "#ff0080",
            options: [{ label: "Gen Z (18-24)", v: 70 }, { label: "Millennial (25-34)", v: 95 }, { label: "Gen X/Boomer (35+)", v: 40 }] 
          },
          { 
            title: "Current Skill Level", 
            color: "#00dfd8",
            options: [{ label: "Entry Level", v: 50 }, { label: "Intermediate", v: 85 }, { label: "Senior/Expert", v: 35 }] 
          }
        ].map((poll, i) => (
          <div key={i} className="card" style={{ background: 'var(--accents-1)', border: '1px solid var(--border)', padding: '40px' }}>
            <h3 style={{ marginBottom: '30px', fontSize: '1.25rem', fontWeight: 800 }}>{poll.title}</h3>
            {poll.options.map((opt, j) => (
              <div key={j} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 700 }}>
                  <span>{opt.label}</span>
                  <span style={{ color: poll.color }}>{opt.v}%</span>
                </div>
                <div style={{ height: '10px', background: 'var(--accents-2)', borderRadius: '5px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: `${opt.v}%` }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    style={{ height: '100%', background: poll.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);




import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const PrivacyPage = () => (
  <div className="container" style={{ padding: '80px 0', maxWidth: '900px' }}>
    <BouncingTitle text="Privacy Policy" style={{ fontSize: '4rem', marginBottom: '40px', fontWeight: 900 }} />
    <div className="card" style={{ padding: '60px', lineHeight: '1.8' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>Last Updated: May 11, 2026</p>
      
      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>1. Data Collection & Sources</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We collect only the data necessary to provide you with a high-performance assessment experience. This includes information you provide directly (like your username) and data generated by your interactions with the platform (like quiz scores, time taken per question, and category preferences).</p>
      
      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>2. How We Use Your Information</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Your data is primarily used to power the Quiz infrastructure, including:
        <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
          <li>Generating personal performance dashboards and progress charts.</li>
          <li>Calculating global leaderboard rankings and percentile rankings.</li>
          <li>Improving our scientific assessment algorithms for better course mastery.</li>
          <li>Maintaining security and preventing manipulation of quiz results.</li>
        </ul>
      </p>
      
      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>3. Data Retention & Deletion</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We retain your study history for as long as your account is active. You may request total data deletion at any time through your dashboard settings. Once deleted, progress cannot be recovered from the Knowledge Cloud.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>4. Cookies and Tracking</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We use essential cookies to maintain your session and remember your theme preferences. We do not use third-party tracking cookies for advertising purposes.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>5. Third-Party Sharing</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Quiz does not sell or lease student data to third parties. Data is only shared when required by university-integrated systems or by legal mandates.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>6. Changes to This Policy</h3>
      <p style={{ color: 'var(--text-muted)' }}>We may update our privacy protocols as we introduce new assessment features. Students will be notified via the dashboard of any significant changes.</p>
    </div>
  </div>
);

const TermsPage = () => (
  <div className="container" style={{ padding: '80px 0', maxWidth: '900px' }}>
    <BouncingTitle text="Terms of Service" style={{ fontSize: '4rem', marginBottom: '40px', fontWeight: 900 }} />
    <div className="card" style={{ padding: '60px', lineHeight: '1.8' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>Last Updated: May 11, 2026</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>1. Acceptable Use Policy</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Quiz is built for academic integrity. Users must not:
        <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
          <li>Use automated scripts to generate scores.</li>
          <li>Attempt to reverse-engineer the assessment engine.</li>
          <li>Share account credentials with other students.</li>
          <li>Upload malicious content through the study group features.</li>
        </ul>
      </p>
      
      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>2. Account Responsibility</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>You are soleley responsible for all activity under your username. Quiz is not liable for data loss due to unauthorized account access if user-side security is compromised.</p>
      
      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>3. Service Availability & Uptime</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>While we strive for 100% availability of the Knowledge Cloud, we do not guarantee uninterrupted access during university exam periods where traffic may peak. Scheduled maintenance is typically performed during low-traffic hours.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>4. Intellectual Property</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The UI design, code, and quiz questions are the intellectual property of Quiz Inc. Users are granted a limited license to use the platform for personal study only.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>5. Limitation of Liability</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Quiz provides assessment tools "as-is". We are not responsible for any specific academic outcomes or grades achieved by users in their official university courses.</p>

      <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>6. Termination</h3>
      <p style={{ color: 'var(--text-muted)' }}>We reserve the right to suspend or terminate accounts that violate our academic integrity protocols without prior notice.</p>
    </div>
  </div>
);

const StudyGroupsPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  
  // Initialize from localStorage
  const [groups, setGroups] = useState<any[]>(() => {
    const saved = localStorage.getItem('study_groups');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save to localStorage whenever groups change
  useEffect(() => {
    localStorage.setItem('study_groups', JSON.stringify(groups));
  }, [groups]);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);

  const requireLogin = (action: () => void) => {
    if (!username) { navigate('/login'); return; }
    action();
  };

  const handleJoin = (id: number) => {
    requireLogin(() =>
      setGroups(prev => prev.map(g =>
        g.id === id && !g.joined ? { ...g, members: g.members + 1, joined: true } : g
      ))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const colors = ['#0070f3', '#7928ca', '#ff0080', '#f5a623', '#50e3c2'];
    const newGroup = {
      id: Date.now(),
      name: newName.trim(),
      members: 1,
      activity: 'Just Created',
      color: colors[Math.floor(Math.random() * colors.length)],
      joined: true,
      messages: [] as any[],
    };
    setGroups(prev => [newGroup, ...prev]);
    setNewName('');
    setShowCreate(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeChat) return;
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { u: username || 'You', m: text.trim(), t };
    const updatedGroup = { ...activeChat, messages: [...(activeChat.messages || []), newMsg] };
    setGroups(prev => prev.map(g => g.id === activeChat.id ? updatedGroup : g));
    setActiveChat(updatedGroup);
  };

  return (
    <div className="container" style={{ padding: '80px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <BouncingTitle text="Study Groups" style={{ fontSize: '4rem', fontWeight: 900 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '10px' }}>Collaborate, share knowledge, and master your courses.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => requireLogin(() => setShowCreate(true))}
          className="btn btn-primary" style={{ padding: '14px 28px', fontWeight: 700 }}
        >
          + Create New Group
        </motion.button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
            >
              <h2 style={{ marginBottom: '8px', fontWeight: 800, fontSize: '1.8rem' }}>Create Study Group</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                Creating as <strong style={{ color: 'var(--primary)' }}>{username}</strong>
              </p>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group Name</label>
                  <input
                    autoFocus value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Organic Chemistry 101"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--accents-1)', color: 'var(--text-main)', fontSize: '1rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>Create Group</button>
                  <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {activeChat && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '420px', background: 'var(--bg-color)', borderLeft: '1px solid var(--border)', zIndex: 2100, boxShadow: '-20px 0 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accents-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${activeChat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeChat.color }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>{activeChat.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeChat.members} member{activeChat.members !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(activeChat.messages || []).length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', padding: '40px 0' }}>
                  <MessageSquare size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>No messages yet</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Say hello to the group!</p>
                </div>
              ) : (
                (activeChat.messages || []).map((msg: any, i: number) => {
                  const isMe = msg.u === username;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: '5px', display: 'flex', gap: '6px', color: isMe ? activeChat.color : 'var(--text-muted)' }}>
                        <span>{isMe ? 'You' : msg.u}</span>
                        <span style={{ fontWeight: 400 }}>{msg.t}</span>
                      </div>
                      <div style={{ padding: '10px 16px', background: isMe ? activeChat.color : 'var(--accents-1)', color: isMe ? '#fff' : 'var(--text-main)', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px', border: isMe ? 'none' : '1px solid var(--border)', maxWidth: '85%', wordBreak: 'break-word', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        {msg.m}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--accents-1)' }}>
              <input
                id={`chat-input-${activeChat.id}`}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '12px 18px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                className="btn btn-primary"
                style={{ borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}
                onClick={() => {
                  const input = document.getElementById(`chat-input-${activeChat.id}`) as HTMLInputElement;
                  if (input) { sendMessage(input.value); input.value = ''; }
                }}
              >
                <MessageSquare size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {groups.map((group, i) => (
          <motion.div
            key={group.id} layout
            whileHover={{ y: -8, boxShadow: `0 20px 40px -20px ${group.color}40` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: group.color }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ padding: '10px', background: `${group.color}18`, color: group.color, borderRadius: '12px' }}>
                <Users size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: group.color, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${group.color}15`, padding: '4px 10px', borderRadius: '100px' }}>{group.activity}</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>{group.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.9rem' }}>{group.members} active student{group.members !== 1 ? 's' : ''} participating.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleJoin(group.id)}
                disabled={group.joined}
                className="btn"
                style={{ flex: 1, background: group.joined ? 'var(--success)' : 'var(--accents-1)', color: group.joined ? '#fff' : 'inherit', border: group.joined ? 'none' : '1px solid var(--border)', fontWeight: 700, cursor: group.joined ? 'default' : 'pointer' }}
              >
                {group.joined ? 'Joined ✓' : 'Join Group'}
              </motion.button>
              {group.joined && (
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveChat(group)}
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700 }}
                >
                  <MessageSquare size={16} /> Chat
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}

        {groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 40px', color: 'var(--text-muted)' }}
          >
            <Users size={72} style={{ opacity: 0.1, marginBottom: '24px' }} />
            <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>No study groups yet.</p>
            <p style={{ fontSize: '1rem' }}>
              {username
                ? 'Be the first to create one using the button above!'
                : <span>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>sign in</Link> to create or join a study group.</span>
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};






// --- Main App Component ---

// --- Scroll to Top on Navigation ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useTheme();

  return (
    <div style={{ minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/quiz/:categoryId/:difficulty" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/groups" element={<StudyGroupsPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
