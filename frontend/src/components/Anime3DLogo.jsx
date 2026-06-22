import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Anime3DLogo Component
 * Provides a 3D tilt and float effect using Anime.js v3
 */
const Anime3DLogo = ({ src, alt, className, intensity = 15 }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!logoRef.current) return;

    // Initial floating animation
    const floatAnim = anime({
      targets: logoRef.current,
      translateY: [-5, 5],
      duration: 3000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    return () => floatAnim.pause();
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !logoRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt (rotation)
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    // Apply 3D rotation and scale
    anime({
      targets: logoRef.current,
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      duration: 150,
      easing: 'easeOutQuad'
    });

    // Animate glow effect based on mouse position
    if (glowRef.current) {
        anime({
            targets: glowRef.current,
            translateX: (x - centerX) * 0.5,
            translateY: (y - centerY) * 0.5,
            opacity: 0.8,
            duration: 150,
            easing: 'easeOutQuad'
        });
    }
  };

  const handleMouseLeave = () => {
    if (!logoRef.current) return;

    // Reset logo position
    anime({
      targets: logoRef.current,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 800,
      easing: 'easeOutElastic(1, .5)'
    });

    // Fade out glow
    if (glowRef.current) {
        anime({
            targets: glowRef.current,
            opacity: 0,
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 flex items-center justify-center ${className}`}
      style={{ perspective: '1000px', cursor: 'pointer' }}
    >
      {/* Dynamic Glow Effect */}
      <div 
        ref={glowRef}
        className="absolute w-full h-full bg-cyan-500/20 blur-3xl rounded-full opacity-0 pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      />
      
      <img 
        ref={logoRef}
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      />
    </div>
  );
};

export default Anime3DLogo;
