'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';

type StatsItemProps = {
  counter: number;
  title: string;
  suffix?: string;
  prefix?: string;
};

export const StatsItem = forwardRef<HTMLDivElement, StatsItemProps>(
  ({ counter, suffix, prefix, title }, continerRef) => {
    const [inView, setInView] = useState(false);

    const viewPortHandler = () => {
      if (inView) return;
      setInView(true);
    };

    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (!inView) return;
      const node = nodeRef.current;
      if (!node) return;

      const controls = animate(0, counter, {
        duration: 1,
        onUpdate(value) {
          node.textContent = value.toFixed(3).replace(/[.,]000$/, '');
        },
      });

      return () => controls.stop();
    }, [counter, inView]);

    return (
      <div className="stats text-center" ref={continerRef}>
        {/* eslint-disable-next-line react/jsx-no-undef */}

        <motion.div
          className="text-primary text-4xl font-extrabold leading-none md:text-5xl"
          onViewportEnter={viewPortHandler}>
          {prefix}
          <span ref={nodeRef} />
          {suffix}
        </motion.div>
        <h3 className="text-md -tracking-tightest mb-0 mt-2.5 font-bold uppercase text-gray-500 md:mt-[14px]">
          {title}
        </h3>
      </div>
    );
  },
);

export default StatsItem;
