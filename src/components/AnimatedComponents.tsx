import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// --- Animated Counter ---
export const StatCounter = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    }, { threshold: 0.1 });

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

// --- Bouncing Typewriter Title ---
export const BouncingTitle = ({ text, style = {} }: { text: string, style?: React.CSSProperties }) => {
  const words = text.split(" ");
  
  return (
    <h2 style={{ 
      ...style, 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: style.textAlign === 'center' ? 'center' : 'flex-start', 
      alignItems: 'center',
      gap: '0.25em' 
    }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: (i * 0.1) + (j * 0.05)
              }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {i < words.length - 1 && <span style={{ width: '0.25em' }}>&nbsp;</span>}
        </span>
      ))}
    </h2>
  );
};
