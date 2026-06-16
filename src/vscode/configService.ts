// Typed access to the `hats.*` settings. Keeps the rest of the code free of
// stringly-typed configuration lookups.

import * as vscode from 'vscode';
import { EnabledElements, Hat, DEFAULT_PALETTE } from '../core/palette';

const SECTION = 'hats';

/** Settings keys this extension owns, for change detection. */
export const HATS_SECTION = SECTION;

function config(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration(SECTION);
}

/** The accent color Hats last applied, or empty string when none. */
export function getColor(): string {
	return config().get<string>('color', '');
}

/** Persist the applied accent color at the workspace level. */
export async function setColor(color: string): Promise<void> {
	await config().update('color', color, vscode.ConfigurationTarget.Workspace);
}

/** Which workbench elements the hat color should tint. */
export function getEnabledElements(): EnabledElements {
	return config().get<EnabledElements>('elements', {
		titleBar: true,
		activityBar: true,
		statusBar: true,
	});
}

/** The configured palette, falling back to the built-in one when empty. */
export function getPalette(): readonly Hat[] {
	const configured = config().get<Hat[]>('palette', []);
	return configured.length > 0 ? configured : DEFAULT_PALETTE;
}

/** Status bar side; defaults to the right corner. */
export function getStatusBarAlignment(): vscode.StatusBarAlignment {
	const side = config().get<'left' | 'right'>('statusBar.alignment', 'right');
	return side === 'left'
		? vscode.StatusBarAlignment.Left
		: vscode.StatusBarAlignment.Right;
}

/** Whether to render the workspace name on the button. */
export function getShowWorkspaceName(): boolean {
	return config().get<boolean>('statusBar.showWorkspaceName', true);
}
