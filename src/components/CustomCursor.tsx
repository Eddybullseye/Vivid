import React, { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Only engage custom cursor on standard desktop pointer fine displays
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let currentPos = { x: -100, y: -100 };
    let targetPos = { x: -100, y: -100 };
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos = { x: e.clientX, y: e.clientY };
      setPosition(targetPos);
    };

    // Smooth physics representation with continuous 60fps linear interpolation (lerp)
    const updateRing = () => {
      const ease = 0.16; // 200ms lag response
      currentPos.x += (targetPos.x - currentPos.x) * ease;
      currentPos.y += (targetPos.y - currentPos.y) * ease;
      setRingPosition({ x: currentPos.x, y: currentPos.y });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    // Dynamically detect all anchor tags, buttons, inputs, category selectors, etc.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('cursor-pointer') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    // Spawn brand vermillion custom ripple pulse overlay
    const handleMouseDown = (e: MouseEvent) => {
      setPulses((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    updateRing();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // Handle ripple lifespan garbage collection
  useEffect(() => {
    if (pulses.length === 0) return;
    const timer = setTimeout(() => {
      setPulses((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [pulses]);

  if (isMobile) return null;

  return (
    <>
      {/* 🔴 Dynamic Custom Solid Cursor Center */}
      <div
        className="custom-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '20px' : '10px',
          height: isHovered ? '20px' : '10px',
          backgroundColor: isHovered ? 'rgba(232, 75, 31, 0.95)' : '#e84b1f',
        }}
      />

      {/* 🎯 Lag Trailing Target Ring */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          width: isHovered ? '50px' : '32px',
          height: isHovered ? '50px' : '32px',
          borderColor: isHovered ? '#e84b1f' : 'rgba(232, 75, 31, 0.45)',
          backgroundColor: isHovered ? 'rgba(232, 75, 31, 0.12)' : 'transparent',
        }}
      />

      {/* 💥 Click Shockwave Overlay */}
      {pulses.map((pulse) => (
        <div
          key={pulse.id}
          className="custom-cursor-pulse"
          style={{
            left: `${pulse.x}px`,
            top: `${pulse.y}px`,
          }}
        />
      ))}
    </>
  );
}
