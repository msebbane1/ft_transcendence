import React, { useEffect } from 'react';
import './ParticlesBackground.css';
import Particles from 'react-tsparticles';


const particlesConfig = {
  particles: {
    number: {
      value: 100,
    },
    size: {
      value: 3,
    },
  },
};

const ParticlesBackground = () => {
  return (
    <div className="particles-container">
      <Particles options={particlesConfig} />
    </div>
  );
};


export default ParticlesBackground;

