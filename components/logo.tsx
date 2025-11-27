import * as React from "react"

type LogoMarkProps = Omit<React.ComponentPropsWithoutRef<"svg">, "title"> & {
	title?: string | null
}

export function LogoMark({ className, title, ...props }: LogoMarkProps) {
	const resolvedTitle = title === undefined ? "Logo" : title
	const normalizedTitle = typeof resolvedTitle === "string" ? resolvedTitle : ""
	const hasAccessibleTitle = normalizedTitle.trim().length > 0

	const graphic = (
		<>
			{hasAccessibleTitle ? <title>{normalizedTitle}</title> : null}
			<circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
			<circle cx="24" cy="15.5" r="4" fill="currentColor" />
			<path
				d="M24 20c-6.5 8.5-13 9.5-13 17 0 2 1.2 3 3 3 5 0 10-6 10-10 0 4 5 10 10 10 1.8 0 3-1 3-3 0-7.5-6.5-8.5-13-17z"
				fill="currentColor"
			/>
		</>
	)

	if (hasAccessibleTitle) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 48 48"
				className={className}
				role="img"
				{...props}
			>
				{graphic}
			</svg>
		)
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 48"
			className={className}
			role="presentation"
			aria-hidden="true"
			{...props}
		>
			{graphic}
		</svg>
	)
}


