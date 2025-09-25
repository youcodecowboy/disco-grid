"use client"

import type { PropsWithChildren } from "react"
import { gridContainerClass } from "@/lib/grid/container"

interface GridContainerProps {
  className?: string
}

export function GridContainer({ children, className }: PropsWithChildren<GridContainerProps>) {
  const composedClass = className ? `${gridContainerClass()} ${className}` : gridContainerClass()

  return <div className={composedClass}>{children}</div>
}
