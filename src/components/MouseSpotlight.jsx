import React, { useEffect, useState } from 'react';

export const MouseSpotlight = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className="mouse-spotlight"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 157, 0.06), transparent 40%)`,
                opacity: opacity,
            }}
        />
    );
};
