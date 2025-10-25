import React, { useEffect, useRef, useState } from 'react'

const Star = ({ filled, size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

/**
 * Rating props
 * - value: number | undefined (if provided -> controlled mode)
 * - total: number
 * - size: number
 * - readOnly: boolean
 * - onChange: function(newValue)
 * - showNumber: boolean
 */
const Rating = ({
  value = undefined,    // if undefined -> uncontrolled
  total = 5,
  size = 18,
  readOnly = false,     // default to interactive
  onChange,
  showNumber = false,
  className = ''
}) => {
  const isControlled = value !== undefined && value !== null
  const [internal, setInternal] = useState(() => {
    // initialize internal with controlled value or 0
    return Math.max(0, Math.min(total, Number(value) || 0))
  })
  const [hover, setHover] = useState(0)
  const rootRef = useRef(null)

  // keep internal in sync with value if controlled (useful if user switches modes)
  useEffect(() => {
    if (isControlled) {
      setInternal(Math.max(0, Math.min(total, Number(value) || 0)))
    }
  }, [value, total, isControlled])

  const displayed = hover ? hover : (isControlled ? Math.max(0, Math.min(total, Number(value) || 0)) : internal)

  const setRating = (v) => {
    if (readOnly) return
    // always notify
    if (typeof onChange === 'function') onChange(v)
    // only update internal if uncontrolled
    if (!isControlled) {
      setInternal(v)
    }
  }

  const onKeyDown = (e) => {
    if (readOnly) return
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setRating(Math.max(0, displayed - 1))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setRating(Math.min(total, displayed + 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setRating(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setRating(total)
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        ref={rootRef}
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${displayed} of ${total}`}
        tabIndex={readOnly ? -1 : 0}
        onKeyDown={onKeyDown}
        className="inline-flex items-center gap-1"
      >
        {Array.from({ length: total }, (_, i) => {
          const idx = i + 1
          const isFilled = idx <= displayed
          const colorClass = isFilled ? 'text-yellow-400' : 'text-gray-300'

          return (
            <button
              key={idx}
              type="button"
              onClick={readOnly ? undefined : () => setRating(idx)}
              onMouseEnter={readOnly ? undefined : () => setHover(idx)}
              onMouseLeave={readOnly ? undefined : () => setHover(0)}
              className={`${colorClass} transition-colors focus:outline-none p-0 m-0 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
              aria-label={`${idx} ${idx === 1 ? 'star' : 'stars'}`}
              aria-pressed={idx <= displayed}
              disabled={readOnly}
              tabIndex={readOnly ? -1 : 0}
              style={{ background: 'transparent', border: 'none' }}
            >
              <Star filled={isFilled} size={size} />
            </button>
          )
        })}
      </div>

      {showNumber && <span className="text-sm text-gray-600">{displayed}/{total}</span>}
    </div>
  )
}

export default Rating
