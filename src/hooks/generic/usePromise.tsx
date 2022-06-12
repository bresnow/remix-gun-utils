import { useSafeEffect } from "bresnow_utility-react-hooks"
import { useCallback, useEffect, useState } from "react"

export default function usePromise<T>(callback:()=>Promise<T>,dependencies = []) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [value, setValue] = useState<T>()

  const memoized = useCallback(() => {
    setLoading(true)
    setError(undefined)
    setValue(undefined)
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false))
  }, dependencies)

  useSafeEffect(() => {
    memoized()
  }, [memoized])

  return { loading, error, value }
}