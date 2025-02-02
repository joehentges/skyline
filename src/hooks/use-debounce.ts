import { useCallback, useRef } from "react"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        func(...args)
        timeoutRef.current = null
      }, delay)
    },
    [func, delay]
  )

  return debouncedFunc
}
