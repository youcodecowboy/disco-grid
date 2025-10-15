"use client"

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface CounterAnimatedV3Props {
  title?: string
  value?: number
  previousValue?: number
  prefix?: string // e.g., "$", "€"
  suffix?: string // e.g., "K", "M", "%"
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  sparklineData?: number[]
}

// Animated number component
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(value, {
    bounce: 0,
    duration: 2000
  })

  const display = useTransform(spring, (latest) => {
    return prefix + Math.round(latest).toLocaleString() + suffix
  })

  const [displayValue, setDisplayValue] = useState(prefix + value.toLocaleString() + suffix)

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [display])

  return <span>{displayValue}</span>
}

export default function CounterAnimatedV3({
  title = "Metric",
  value = 1234,
  previousValue,
  prefix = '',
  suffix = '',
  subtitle = 'Total count',
  trend = 'up',
  sparklineData
}: CounterAnimatedV3Props) {
  const [currentValue, setCurrentValue] = useState(value)
  const [animationKey, setAnimationKey] = useState(0)

  // Auto-increment effect for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const change = trend === 'up' ? Math.floor(Math.random() * 5) + 1 : 
                     trend === 'down' ? -(Math.floor(Math.random() * 5) + 1) : 
                     Math.floor(Math.random() * 3) - 1
      
      setCurrentValue(prev => Math.max(0, prev + change))
      setAnimationKey(prev => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [trend])

  // Calculate change
  const change = previousValue ? currentValue - previousValue : 0
  const changePercent = previousValue && previousValue !== 0 
    ? ((change / previousValue) * 100).toFixed(1) 
    : '0'

  // Generate sparkline if not provided
  const sparkline = sparklineData || Array.from({ length: 12 }, () => Math.random() * 100)
  const maxSparkline = Math.max(...sparkline)

  const trendColors = {
    up: { text: 'text-emerald-600', bg: 'bg-emerald-50', icon: '↑', gradient: 'from-emerald-400 to-emerald-600' },
    down: { text: 'text-red-600', bg: 'bg-red-50', icon: '↓', gradient: 'from-red-400 to-red-600' },
    neutral: { text: 'text-slate-600', bg: 'bg-slate-50', icon: '→', gradient: 'from-slate-400 to-slate-600' }
  }

  const config = trendColors[trend]

  return (
    <div className="h-full w-full bg-gradient-to-br from-white to-slate-50 rounded-lg overflow-hidden flex flex-col border border-slate-200">
      {/* Header */}
      {title && (
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      {/* Main Counter */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        {/* Large animated number */}
        <motion.div
          key={animationKey}
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow effect on change */}
          <motion.div
            key={`glow-${animationKey}`}
            className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20 blur-xl`}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1 }}
          />

          <div className="text-5xl md:text-6xl font-bold text-slate-900 relative">
            <AnimatedNumber value={currentValue} prefix={prefix} suffix={suffix} />
          </div>
        </motion.div>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 mt-2 font-medium">{subtitle}</p>

        {/* Change indicator */}
        {previousValue && (
          <div className={`inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-sm font-semibold
                        ${config.bg} ${config.text} w-fit`}>
            <span className="text-lg">{config.icon}</span>
            <span>{Math.abs(change).toLocaleString()}</span>
            <span className="text-xs">({changePercent}%)</span>
          </div>
        )}
      </div>

      {/* Sparkline */}
      <div className="px-6 pb-6">
        <div className="h-16 flex items-end gap-1">
          {sparkline.map((value, i) => (
            <motion.div
              key={i}
              className={`flex-1 bg-gradient-to-t ${config.gradient} rounded-t-sm opacity-70`}
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxSparkline) * 100}%` }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
            />
          ))}
        </div>
        <div className="text-xs text-slate-400 mt-2 text-center">Last 12 periods</div>
      </div>

      {/* Pulse animation for live feel */}
      <motion.div
        className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400"
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}


