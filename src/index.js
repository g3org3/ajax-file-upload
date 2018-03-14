'use strict'

export default function fileUpload ({ file, endpoint, onProgress, onLoad, onReadyStateChange }) {
  const xhr = new XMLHttpRequest()
  const formdata = new FormData()
  const parseJSON = (raw) => {
    try {
      return JSON.parse(raw) || raw
    } catch (e) {
      return raw
    }
  }
  const isFunc = (func) => (typeof func === 'function')

  formdata.append('file', file)
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total)
      if (isFunc(onProgress)) onProgress(percentage)
    }
  }
  xhr.upload.onload = (e) => {
    if (isFunc(onLoad)) onLoad(e)
  }

  xhr.onreadystatechange = () => {
    const { status, responseText } = xhr
    if (status) {
      const isJson = xhr.getResponseHeader('Content-Type')
        .split(';')
        .filter(line => line === 'application/json')
        .length === 1
      if (isFunc(onReadyStateChange)) {
        onReadyStateChange({
          status,
          response: isJson ? parseJSON(responseText) : responseText
        })
      }
    }
  }

  xhr.open('POST', endpoint)
  xhr.send(formdata)
}