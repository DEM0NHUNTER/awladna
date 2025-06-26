import React, { ReactNode, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: string;
  duration?: number;
  delay?: number;
  once?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fade-up',
  duration = 700,
  delay = 0,
  once = true,
}) => {
  useEffect(() => {
    AOS.init({
      duration,
      delay,
      once,
      easing: 'ease-out-cubic',
      disable: 'phone',
    });
    AOS.refresh();
  }, [duration, delay, once]);

  return (
    <div
      data-aos={animation}
      data-aos-duration={duration}
      data-aos-delay={delay}
      data-aos-once={once}
      className="my-8"
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
