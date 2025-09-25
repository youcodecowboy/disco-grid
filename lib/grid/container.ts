export const GRID_CONTAINER_BASE = "w-full mx-auto"

export const GRID_CONTAINER_VARIANTS = {
  default: "max-w-6xl",
  wide: "max-w-screen-2xl",
  full: "max-w-none px-0",
} as const

export type GridContainerVariant = keyof typeof GRID_CONTAINER_VARIANTS

export function gridContainerClass(
  extraClass?: string,
  variant: GridContainerVariant = "default",
) {
  const base = `${GRID_CONTAINER_BASE} ${GRID_CONTAINER_VARIANTS[variant]}`
  return extraClass ? `${base} ${extraClass}` : base
}
