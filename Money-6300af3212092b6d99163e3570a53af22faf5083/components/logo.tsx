import * as React from "react"

type LogoMarkProps = {
	className?: string
	title?: string
}

export function LogoMark({ className, title = "Logo" }: LogoMarkProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 48"
			aria-hidden={title ? undefined : true}
			role={title ? "img" : "presentation"}
			className={className}
		>
			{title ? <title>{title}</title> : null}
			<circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
			<circle cx="24" cy="15.5" r="4" fill="currentColor" />
			<path
				d="M24 20c-6.5 8.5-13 9.5-13 17 0 2 1.2 3 3 3 5 0 10-6 10-10 0 4 5 10 10 10 1.8 0 3-1 3-3 0-7.5-6.5-8.5-13-17z"
				fill="currentColor"
			/>
		</svg>
	)
}


