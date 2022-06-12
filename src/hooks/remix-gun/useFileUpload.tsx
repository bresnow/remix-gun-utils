import { useFetcher } from '@remix-run/react'
import { lzObject } from 'lz-object'
import React from 'react'
import { IGunChain } from 'gun/types'

export function useFileUploader({gunRef}: {gunRef:IGunChain<any>}): [
  {
    result: any
    loading: boolean
    error: any
    data: any
  },
  (e: any) => void
] {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState()
  const [result, setResult] = React.useState()
  let fetcher = useFetcher()
  function imgChange(e: any) {
    let file = e.target.files[0]
    var reader = new FileReader()
    // let blob = new FileReader();
    // blob.onload = function (r: any) {
    //   log(r.target.result, "ArrayBuffer");

    //   fetcher.submit(r.target.result, {
    //     method: "post",
    //     encType: "multipart/form-data",
    //     action,
    //   });
    // };
    // blob.readAsBinaryString(file);
    reader.onloadstart = () => {
      setLoading(true)
      console.log(loading, 'loading')
    }
    reader.onload = (r: any) => {
      let result = r.target.result
      let { file } = lzObject.compress({ file: result }, { output: 'uri' })
      let arr: number[] = Object.values(file)
      setResult(r.target.result)
    }
    reader.onerror = (r: any) => {
      setError(r)
      console.error(r)
    }
    reader.readAsDataURL(file)
  }
  let image = { result, loading, error, data: fetcher.data }
  return [image, imgChange]
}
