'use client';
import { motion } from 'framer-motion';

const Skeleton = ({ type = 'product', count = 1, className = '' }) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  };

  const SkeletonItem = () => (
    <div
      className={`relative overflow-hidden bg-card/40 border border-border/20 rounded-2xl md:rounded-3xl h-full w-full ${className}`}
    >
      <motion.div
        variants={shimmer}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent z-10"
      />

      {type === 'product' && (
        <div className="p-3 space-y-4">
          <div className="aspect-square bg-bg/50 rounded-xl" />
          <div className="space-y-2 px-2 pb-2">
            <div className="h-2 w-1/3 bg-pText/10 rounded-full" />
            <div className="h-4 w-full bg-pText/10 rounded-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 w-1/3 bg-primary/10 rounded-lg" />
              <div className="h-8 w-12 bg-primary/20 rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </>
  );
};

export default Skeleton;
