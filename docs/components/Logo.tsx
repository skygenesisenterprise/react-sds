import type { ComponentPropsWithoutRef } from "react";

/**
 * Local documentation mark for the portal header.
 *
 * React SDS does not ship a logotype component, so this small inline SVG lives
 * in the docs app only. It is not part of the public API and must not be
 * presented as such.
 */
export function Logo(props: ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			width="24"
			height="24"
			role="img"
			aria-hidden="true"
			fill="none"
			{...props}
		>
			<rect width="32" height="32" rx="8" fill="currentColor" opacity="0.12" />
			<path
				d="M9 22V10h4.4c2.7 0 4.3 1.4 4.3 3.6 0 1.6-.9 2.8-2.4 3.3l2.9 5.1h-3l-2.5-4.7H11.8V22H9Zm2.8-6.8h1.5c1.2 0 1.9-.6 1.9-1.6s-.7-1.6-1.9-1.6h-1.5v3.2Z"
				fill="currentColor"
			/>
			<circle cx="22.5" cy="20.5" r="2" fill="currentColor" />
		</svg>
	);
}
