'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Custom 404 page with animated visuals.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-50" />

      <motion.div
        className="relative z-10 max-w-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 404 number with glitch effect */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <h1 className="gradient-text text-9xl font-black tracking-tighter md:text-[12rem]">
            404
          </h1>
          {/* Glitch layers */}
          <motion.span
            className="absolute inset-0 text-9xl font-black tracking-tighter text-cyan-500/30 md:text-[12rem]"
            animate={{
              x: [-2, 2, -2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            404
          </motion.span>
          <motion.span
            className="absolute inset-0 text-9xl font-black tracking-tighter text-violet-500/30 md:text-[12rem]"
            animate={{
              x: [2, -2, 2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 0.1,
            }}
          >
            404
          </motion.span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-white">Page not found</h2>
          <p className="mb-8 text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Navigation options */}
        <motion.div
          className="flex flex-col justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Home
          </Link>

          <Link
            href="#projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-medium text-white transition-all hover:border-white/20 hover:bg-white/5"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
            View Projects
          </Link>
        </motion.div>

        {/* Decorative terminal */}
        <motion.div
          className="mx-auto mt-12 max-w-sm overflow-hidden rounded-lg border border-white/10 bg-black/30 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <p className="text-gray-500">$ curl -I /this-page</p>
            <p className="mt-1 text-red-400">HTTP/1.1 404 Not Found</p>
            <p className="mt-2 text-gray-500">
              $ <span className="animate-pulse text-cyan-400">_</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
