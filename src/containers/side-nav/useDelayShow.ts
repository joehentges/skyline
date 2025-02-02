"use client"

import { useEffect, useState } from "react"

import { useDebounce } from "@/hooks/use-debounce"

export function useDelayShow(show: boolean) {
  const [delayedShow, setDelayedShow] = useState<boolean>()
  const deboundedShow = useDebounce(() => {
    setDelayedShow(true)
  }, 200)

  useEffect(() => {
    if (!show) {
      setDelayedShow(false)
    } else {
      deboundedShow()
    }
    // eslint-disable-next-line
  }, [show])

  return delayedShow
}
