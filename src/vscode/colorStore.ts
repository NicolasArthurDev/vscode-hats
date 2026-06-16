// Adapter that reads and writes `workbench.colorCustomizations` at the
// workspace level, merging non-destructively with the user's own colors.

import * as vscode from 'vscode';
import {
	buildColorCustomizations,
	ColorCustomizations,
	MANAGED_KEYS,
} from '../core/colorScheme';
import { getColor, getEnabledElements, setColor } from './configService';

const WORKBENCH = 'workbench';
const KEY = 'colorCustomizations';

function readCurrent(): ColorCustomizations {
	const current = vscode.workspace
		.getConfiguration(WORKBENCH)
		.get<ColorCustomizations>(KEY, {});
	return { ...current };
}

async function write(value: ColorCustomizations): Promise<void> {
	await vscode.workspace
		.getConfiguration(WORKBENCH)
		.update(KEY, value, vscode.ConfigurationTarget.Workspace);
}

/** Apply `color` to the enabled elements, preserving unrelated keys. */
export async function apply(color: string): Promise<void> {
	const merged = withoutManagedKeys(readCurrent());
	const hatColors = buildColorCustomizations(color, getEnabledElements());
	await write({ ...merged, ...hatColors });
	await setColor(color);
}

/** Remove only the keys Hats manages, leaving the user's colors intact. */
export async function clear(): Promise<void> {
	const stripped = withoutManagedKeys(readCurrent());
	// Persisting an empty object would leave a noisy `{}` behind; drop the
	// whole key instead when nothing else remains.
	await write(Object.keys(stripped).length > 0 ? stripped : undefined!);
	await setColor('');
}

/**
 * Re-apply the stored color on startup. Workspaces sometimes lose
 * customizations on open, so this keeps the window in sync.
 */
export async function reapplyStoredColor(): Promise<void> {
	const color = getColor();
	if (color) {
		await apply(color);
	}
}

function withoutManagedKeys(colors: ColorCustomizations): ColorCustomizations {
	const result = { ...colors };
	for (const key of MANAGED_KEYS) {
		delete result[key];
	}
	return result;
}
