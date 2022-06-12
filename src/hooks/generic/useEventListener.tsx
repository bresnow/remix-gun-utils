import { useSafeEffect } from "bresnow_utility-react-hooks"
import { useEffect, useRef } from "react"

export default function useEventListener(
  eventType:string,
  callback:any,
  element = window
) {
  const callbackRef = useRef(callback)
const elementRef = useRef(element)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useSafeEffect(() => {
    if (element == null) return
    
    const handler = (e:Event) => callbackRef.current(e)
    element.addEventListener(eventType, handler)

    return () => element.removeEventListener(eventType, handler)
  }, [eventType, element])
}