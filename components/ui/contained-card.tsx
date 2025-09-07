import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ContainedCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  headerContent?: React.ReactNode
  showHeader?: boolean
  variant?: 'default' | 'compact'
}

/**
 * ContainedCard - A card component that enforces proper content containment
 * 
 * This component solves the "floating content" problem by:
 * 1. Using flexbox with proper overflow handling
 * 2. Enforcing height constraints
 * 3. Preventing content from escaping boundaries
 * 4. Providing consistent layout patterns
 */
export function ContainedCard({ 
  title, 
  children, 
  className, 
  headerContent,
  showHeader = true,
  variant = 'default'
}: ContainedCardProps) {
  return (
    <Card className={cn(
      "h-full shadow-sm border-2 rounded-none relative overflow-hidden",
      className
    )}>
             {showHeader && (
         <CardHeader className={cn(
           "flex flex-row items-center justify-between space-y-0 px-4 border-b-2 flex-shrink-0",
           variant === 'compact' ? "h-8" : "h-10"
         )}>
           {title && (
             <CardTitle className="font-medium text-sm truncate">
               {title}
             </CardTitle>
           )}
           {headerContent && (
             <div className="flex items-center gap-1 flex-shrink-0">
               {headerContent}
             </div>
           )}
         </CardHeader>
       )}
      <CardContent 
        className={cn(
          "flex flex-col h-full overflow-hidden",
          variant === 'compact' ? "p-2" : "p-4"
        )}
                 style={{ 
           height: showHeader 
             ? `calc(100% - ${variant === 'compact' ? '32px' : '40px'})` 
             : '100%' 
         }}
      >
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * ContainedContent - A wrapper that enforces content containment
 * 
 * Use this for any content that needs to stay within boundaries:
 * - Tables with scrollable bodies
 * - Lists with overflow
 * - Text content that might be long
 * - Any content that could potentially overflow
 */
export function ContainedContent({ 
  children, 
  className,
  scrollable = false,
  direction = 'vertical'
}: {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
  direction?: 'vertical' | 'horizontal' | 'both'
}) {
  const scrollClasses = {
    vertical: scrollable ? 'overflow-y-auto' : 'overflow-hidden',
    horizontal: scrollable ? 'overflow-x-auto' : 'overflow-hidden',
    both: scrollable ? 'overflow-auto' : 'overflow-hidden'
  }

  return (
    <div className={cn(
      "flex-1 min-h-0",
      scrollClasses[direction],
      className
    )}>
      {children}
    </div>
  )
}

/**
 * ContainedFlex - A flex container that respects boundaries
 * 
 * Use this for layouts that need to be contained:
 * - Button groups
 * - Metric cards
 * - Form layouts
 * - Any flex layout that might overflow
 */
export function ContainedFlex({ 
  children, 
  className,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'start',
  gap = 'default'
}: {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col'
  wrap?: boolean
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  align?: 'start' | 'end' | 'center' | 'stretch'
  gap?: 'none' | 'sm' | 'default' | 'lg'
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around'
  }

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch'
  }

  const gapClasses = {
    none: '',
    sm: 'gap-1',
    default: 'gap-2',
    lg: 'gap-4'
  }

  return (
    <div className={cn(
      "flex overflow-hidden",
      directionClasses[direction],
      wrap && "flex-wrap",
      justifyClasses[justify],
      alignClasses[align],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

/**
 * ContainedGrid - A grid container that respects boundaries
 * 
 * Use this for grid layouts that need to be contained:
 * - Metric card grids
 * - Dashboard layouts
 * - Any grid that might overflow
 */
export function ContainedGrid({ 
  children, 
  className,
  cols = 1,
  gap = 'default'
}: {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'sm' | 'default' | 'lg'
}) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  }

  const gapClasses = {
    none: '',
    sm: 'gap-1',
    default: 'gap-2',
    lg: 'gap-4'
  }

  return (
    <div className={cn(
      "grid overflow-hidden",
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

/**
 * ContainedText - Text content that respects boundaries
 * 
 * Use this for any text content that might overflow:
 * - Long descriptions
 * - Lists
 * - Notes
 * - Any text that could be longer than the container
 */
export function ContainedText({ 
  children, 
  className,
  scrollable = true,
  preserveWhitespace = false
}: {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
  preserveWhitespace?: boolean
}) {
  return (
    <div className={cn(
      "text-sm text-muted-foreground",
      preserveWhitespace && "whitespace-pre-line",
      scrollable ? "overflow-auto flex-1" : "overflow-hidden flex-1",
      className
    )}>
      {children}
    </div>
  )
}
