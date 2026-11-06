"use client";

/**
 * Client boundary for the components rendered inside MDX demos.
 *
 * MDX pages are server components. Importing the package barrel there would pull
 * hook-based components (ToggleSwitch, Notice, …) into the server graph, which
 * Next.js rejects. Re-exporting the barrel from a client module keeps the demos
 * interactive while server pages only render the client boundary.
 *
 * Code samples in the documentation still show the public import from
 * `@skygenesisenterprise/react-sds`; this wrapper exists only to compile them.
 */
export * from "@skygenesisenterprise/react-sds";
