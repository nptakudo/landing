"use client";

import { useEffect, useState } from "react";

const phrases = [
    "Write in Obsidian.",
    "Publish to the web.",
    "Connect your ideas.",
    "Build a digital garden.",
    "Search everything instantly.",
];

export function TypewriterHero() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of the phrase
            const timeout = setTimeout(() => setIsDeleting(true), 2000);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const speed = isDeleting ? 40 : 80;
        const timeout = setTimeout(() => {
            setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
        }, speed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex]);

    const currentText = phrases[phraseIndex].slice(0, charIndex);

    return (
        <span className="inline-flex items-baseline gap-0.5">
            <span className="bg-gradient-to-r from-[var(--accent)] to-[color:oklch(0.65_0.25_280)] bg-clip-text text-transparent">
                {currentText}
            </span>
            <span className="inline-block h-[1em] w-[3px] animate-blink rounded-full bg-[var(--accent)]" />
        </span>
    );
}
