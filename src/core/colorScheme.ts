// Pure color logic: turn an accent color + enabled elements into a
// `workbench.colorCustomizations` map. No VSCode imports here, so it is
// fully unit-testable.

import { EnabledElements } from './palette';

/** A map of `workbench.colorCustomizations` keys to color values. */
export type ColorCustomizations = Record<string, string>;

const TITLE_BAR_KEYS = [
	'titleBar.activeBackground',
	'titleBar.activeForeground',
	'titleBar.inactiveBackground',
	'titleBar.inactiveForeground',
] as const;

const ACTIVITY_BAR_KEYS = [
	'activityBar.background',
	'activityBar.foreground',
	'activityBar.inactiveForeground',
] as const;

const STATUS_BAR_KEYS = ['statusBar.background', 'statusBar.foreground'] as const;

/** Every customization key Hats may write — used for non-destructive clears. */
export const MANAGED_KEYS: readonly string[] = [
	...TITLE_BAR_KEYS,
	...ACTIVITY_BAR_KEYS,
	...STATUS_BAR_KEYS,
];

/**
 * Build the customization map for `color`, only for the enabled elements.
 * Foreground colors are chosen for readable contrast against the accent.
 */
export function buildColorCustomizations(
	color: string,
	elements: EnabledElements,
): ColorCustomizations {
	const fg = readableForeground(color);
	const result: ColorCustomizations = {};

	if (elements.titleBar) {
		result['titleBar.activeBackground'] = color;
		result['titleBar.activeForeground'] = fg;
		result['titleBar.inactiveBackground'] = color;
		result['titleBar.inactiveForeground'] = fg;
	}
	if (elements.activityBar) {
		result['activityBar.background'] = color;
		result['activityBar.foreground'] = fg;
		result['activityBar.inactiveForeground'] = fg;
	}
	if (elements.statusBar) {
		result['statusBar.background'] = color;
		result['statusBar.foreground'] = fg;
	}
	return result;
}

/**
 * Pick black or white for best contrast against `hex`, using the WCAG
 * relative-luminance threshold.
 */
export function readableForeground(hex: string): string {
	const { r, g, b } = parseHex(hex);
	const luminance = relativeLuminance(r, g, b);
	return luminance > 0.179 ? '#15202b' : '#ffffff';
}

function parseHex(hex: string): { r: number; g: number; b: number } {
	const value = hex.replace('#', '');
	return {
		r: parseInt(value.slice(0, 2), 16),
		g: parseInt(value.slice(2, 4), 16),
		b: parseInt(value.slice(4, 6), 16),
	};
}

function relativeLuminance(r: number, g: number, b: number): number {
	const [rl, gl, bl] = [r, g, b].map((channel) => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
