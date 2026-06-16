// Pure domain model for "hats" (named accent colors). No VSCode imports here.

/** A named accent color the user can wear for a workspace. */
export interface Hat {
	/** Display name shown in the picker (e.g. "Java", "Python"). */
	readonly name: string;
	/** Accent color as a #rrggbb hex string. */
	readonly color: string;
}

/** The workbench elements a hat color can tint. */
export interface EnabledElements {
	readonly titleBar: boolean;
	readonly activityBar: boolean;
	readonly statusBar: boolean;
}

/**
 * Built-in palette used when the user has not configured `hats.palette`.
 * Colors loosely echo each ecosystem's brand for quick recognition.
 */
export const DEFAULT_PALETTE: readonly Hat[] = [
	{ name: 'Java', color: '#e76f00' },
	{ name: 'Spring', color: '#6db33f' },
	{ name: 'Python', color: '#3776ab' },
	{ name: 'TypeScript', color: '#3178c6' },
	{ name: 'JavaScript', color: '#f7df1e' },
	{ name: 'C#', color: '#9b4f96' },
	{ name: 'Go', color: '#00add8' },
	{ name: 'Rust', color: '#dea584' },
	{ name: 'DevOps', color: '#2496ed' },
];

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Returns true when `value` is a valid #rrggbb hex color. */
export function isHexColor(value: string): boolean {
	return HEX_COLOR.test(value.trim());
}
