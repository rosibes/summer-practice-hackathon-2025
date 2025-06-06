"use client";

import { motion } from "framer-motion";

export const Title = ({
    text = "Excalidraw",
}: {
    text: string;
}) => {
    const headingText = text;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.015,
            },
        },
    };

    const letterAnimation = {
        hidden: {
            opacity: 0,
            filter: "blur(10px)",
        },
        show: {
            opacity: 1,
            filter: "blur(0px)",
        },
    };

    return (
        <>
            <div>
                <motion.h1
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-4xl font-bold"
                >
                    {headingText.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letterAnimation}
                            transition={{ duration: 0.3 }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h1>
            </div>
        </>
    );
};