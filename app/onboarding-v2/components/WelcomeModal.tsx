"use client"

/**
 * Welcome Modal Component
 * 
 * Success modal shown after generation completes
 * Celebrates the completion and shows summary stats
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Package, Workflow, Users, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import type { GenerationContractV1 } from '../types.contract';

interface WelcomeModalProps {
  contract: GenerationContractV1;
  onClose: () => void;
}

export function WelcomeModal({ contract, onClose }: WelcomeModalProps) {
  // Calculate stats from contract
  const stats = {
    items: contract.items.categories.length * 10, // Mock calculation
    workflows: 1, // One workflow created
    teams: contract.teams.departments.length,
    dashboards: contract.analytics.audience.length * 3, // Mock calculation
  };
  
  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: -20, x: Math.random() * 100 - 50 }}
              animate={{
                opacity: 0,
                y: 100,
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
              }}
              className="absolute top-0 left-1/2"
              style={{
                width: 10,
                height: 10,
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="relative p-12 text-center">
          {/* Logo and checkmark */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="h-24 w-24 relative">
                <Image
                  src="/groovy-logo.png"
                  alt="Groovy"
                  fill
                  className="object-contain"
                />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                className="absolute -bottom-2 -right-2 h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Welcome to Your Groovy Application!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-600 mb-8"
          >
            We've configured everything based on your needs
          </motion.p>
          
          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <StatCard
              icon={Package}
              value={stats.items}
              label="items configured"
              color="blue"
              delay={0.6}
            />
            <StatCard
              icon={Workflow}
              value={stats.workflows}
              label={stats.workflows === 1 ? 'workflow created' : 'workflows created'}
              color="purple"
              delay={0.7}
            />
            <StatCard
              icon={Users}
              value={stats.teams}
              label={stats.teams === 1 ? 'team set up' : 'teams set up'}
              color="green"
              delay={0.8}
            />
            <StatCard
              icon={BarChart3}
              value={stats.dashboards}
              label="dashboard blocks ready"
              color="amber"
              delay={0.9}
            />
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              Explore Your Workspace
            </button>
            
            <button
              onClick={onClose}
              className="px-8 py-4 bg-white text-slate-700 text-lg font-semibold border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Take a Quick Tour
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Stat card component
 */
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: any;
  value: number;
  label: string;
  color: string;
  delay: number;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
  }[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200"
    >
      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full ${colorClasses} mb-3`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <div className="text-3xl font-bold text-slate-900 mb-1">
        {value}
      </div>
      
      <div className="text-sm text-slate-600">
        {label}
      </div>
    </motion.div>
  );
}

