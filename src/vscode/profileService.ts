// Thin wrapper over the native VSCode profile commands.
//
// There is currently no public API to read or change the active profile
// (see https://github.com/microsoft/vscode/issues/226355 and #192852), so we
// delegate to built-in commands. Command ids are resolved at runtime to stay
// resilient across VSCode versions.

import * as vscode from 'vscode';

const SWITCH_COMMAND_CANDIDATES = [
	'workbench.profiles.actions.switchProfile',
	'workbench.action.switchProfile',
];

const TEMPLATE_COMMAND_CANDIDATES = [
	'workbench.profiles.actions.createFromTemplate',
	'workbench.profiles.actions.createProfile',
	'workbench.profiles.actions.createTemporaryProfile',
];

/** Open the native "Switch Profile" picker. */
export async function switchProfile(): Promise<void> {
	await runFirstAvailable(SWITCH_COMMAND_CANDIDATES, 'switch profiles');
}

/** Open the native "Create Profile from Template" flow. */
export async function createProfileFromTemplate(): Promise<void> {
	await runFirstAvailable(TEMPLATE_COMMAND_CANDIDATES, 'create profiles');
}

async function runFirstAvailable(
	candidates: readonly string[],
	action: string,
): Promise<void> {
	const available = new Set(await vscode.commands.getCommands(true));
	const command = candidates.find((id) => available.has(id));
	if (!command) {
		await vscode.window.showErrorMessage(
			`Hats could not find a VSCode command to ${action} in this version.`,
		);
		return;
	}
	await vscode.commands.executeCommand(command);
}
