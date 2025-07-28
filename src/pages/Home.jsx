// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.section
      className="section"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <h1>
        Hi, I'm <span style={{ color: "#61dafb" }}>PrithviRaj Deora</span>
      </h1>
      <p>
        Backend engineer passionate about Go and web ecosystems.  
        Explore my projects, skills, and experience.
      </p>
      <div className="social-icons" style={{ marginTop: 32 }}>
        <a className="social-icon" href="https://github.com/prithvideora1524" target="_blank" rel="noopener noreferrer">
          <img src="/github.jpg" alt="GitHub" width={32} />
        </a>
        <a className="social-icon" href="https://linkedin.com/in/prithvi-deora-79535613b" target="_blank" rel="noopener noreferrer">
          <img src="/linkedin.jpg" alt="LinkedIn" width={32} />
        </a>
      </div>
    </motion.section>
  );
}
