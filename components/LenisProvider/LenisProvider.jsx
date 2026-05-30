'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
            infinite: false,
        });

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return children;
}
