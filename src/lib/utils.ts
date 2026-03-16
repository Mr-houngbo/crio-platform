// Simple cn function without external dependencies for now
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
