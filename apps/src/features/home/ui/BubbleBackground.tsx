import React from 'react'

export function BubbleBackground() {
  return (
    <svg
      className="absolute left-0 bottom-0 w-full h-full"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 0 }}
    >
      <ellipse cx="210" cy="405" rx="50" ry="50" fill="#E1F3FE" />
      <ellipse cx="370" cy="370" rx="120" ry="120" fill="#E1F3FE" />
      <ellipse cx="130" cy="420" rx="55" ry="55" fill="#E1F3FE" />
      <ellipse cx="10" cy="370" rx="90" ry="90" fill="#E1F3FE" />
    </svg>
  )
}
