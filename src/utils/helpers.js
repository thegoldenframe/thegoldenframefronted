export const formatPhone = (phone) => phone.replace(/\s/g, '')

export const clsx = (...classes) => classes.filter(Boolean).join(' ')

export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const lerp = (start, end, t) => start + (end - start) * t

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
