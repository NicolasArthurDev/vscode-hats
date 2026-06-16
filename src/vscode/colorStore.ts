// Adapter that reads and writes `workbench.colorCustomizations`.
//
// The accent color is stored at the GLOBAL (user) level so it belongs to the
// active profile: VSCode loads each profile's user settings on switch, so the
// window color follows the profile automatically — no profile API needed.
// We also strip Hats keys from workspace settings, both to migrate older
// per-workspace values and to stop them from shadowing the profile color.

import * as vscode from 'vscode';
import {
	buildColorCustomizations,
	ColorCustomizations,
	MANAGED_KEYS,
} from '../core/colorScheme';
import { getColor, getEnabledElements, setColor } from './configService';

const WORKBENCH = 'workbench';
const KEY = 'colorCustomizations';

const GLOBAL = vscode.ConfigurationTarget.Global;
const WORKSPACE = vscode.ConfigurationTarget.Workspace;

/** Apply `color` to the enabled elements in the active profile's settings. */
export async function apply(color: string): Promise<void> {
	const base = withoutManagedKeys(readAt(GLOBAL));
	const hatColors = buildColorCustomizations(color, getEnabledElements());
	await writeAt(GLOBAL, { ...base, ...hatColors });
	await stripWorkspaceLeftovers();
	await setColor(color);
}

/** Remove only the keys Hats manages, leaving the user's colors intact. */
export async function clear(): Promise<void> {
	await writeAt(GLOBAL, orUndefined(withoutManagedKeys(readAt(GLOBAL))));
	await stripWorkspaceLeftovers();
	await setColor('');
}

/** Ensure the stored color is applied on startup (and migrate legacy keys). */
export async function reapplyStoredColor(): Promise<void> {
	const color = getColor();
	if (color) {
		await apply(color);
	} else {
		await stripWorkspaceLeftovers();
	}
}

function readAt(target: vscode.ConfigurationTarget): ColorCustomizations {
	const inspected = vscode.workspace
		.getConfiguration(WORKBENCH)
		.inspect<ColorCustomizations>(KEY);
	const value =
		target === GLOBAL ? inspected?.globalValue : inspected?.workspaceValue;
	return { ...(value ?? {}) };
}

async function writeAt(
	target: vscode.ConfigurationTarget,
	value: ColorCustomizations | undefined,
): Promise<void> {
	await vscode.workspace.getConfiguration(WORKBENCH).update(KEY, value, target);
}

// Drop Hats-managed keys from workspace settings so older per-workspace values
// no longer override the profile color. No-op when nothing is open or present.
async function stripWorkspaceLeftovers(): Promise<void> {
	const current = readAt(WORKSPACE);
	const stripped = withoutManagedKeys(current);
	if (Object.keys(stripped).length !== Object.keys(current).length) {
		await writeAt(WORKSPACE, orUndefined(stripped));
	}
}

function withoutManagedKeys(colors: ColorCustomizations): ColorCustomizations {
	const result = { ...colors };
	for (const key of MANAGED_KEYS) {
		delete result[key];
	}
	return result;
}

// Persisting `{}` leaves a noisy empty object behind; drop the key instead.
function orUndefined(colors: ColorCustomizations): ColorCustomizations | undefined {
	return Object.keys(colors).length > 0 ? colors : undefined;
}
