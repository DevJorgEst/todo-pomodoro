import type { SVGProps } from 'react'

/**
 * Iconos de interfaz en SVG inline.
 *
 * Se evitan glifos de texto (▶ ⏸ ↺ × ☀️ 🌙): cada plataforma los dibuja con
 * distinta métrica, línea base y hasta color (los emoji), lo que desalinea los
 * botones. Estos iconos heredan `currentColor` y comparten grosor de trazo.
 */

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="7" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" />
      <rect
        x="13.5"
        y="5.5"
        width="3.5"
        height="13"
        rx="1"
        fill="currentColor"
      />
    </Icon>
  )
}

export function ResetIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5v4.8h4.8" />
    </Icon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </Icon>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </Icon>
  )
}
