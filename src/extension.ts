// Composition root: wires the status bar button, commands and startup
// behavior. Keep this file thin — real logic lives in core/ and vscode/.

import * as vscode from 'vscode';
import { StatusBarView } from './vscode/statusBarView';
import { openMenu, pickColor } from './vscode/menu';
import { clear, reapplyStoredColor } from './vscode/colorStore';
import { createProfileFromTemplate, switchProfile } from './vscode/profileService';
import { HATS_SECTION } from './vscode/configService';

const PREFIX = 'hats-profile-switcher';

export function activate(context: vscode.ExtensionContext): void {
	try {
		const statusBar = new StatusBarView();

		context.subscriptions.push(
			statusBar,
			registerCommand(`${PREFIX}.openMenu`, openMenu),
			registerCommand(`${PREFIX}.switchProfile`, switchProfile),
			registerCommand(`${PREFIX}.newProfileFromTemplate`, createProfileFromTemplate),
			registerCommand(`${PREFIX}.setColor`, pickColor),
			registerCommand(`${PREFIX}.clearColor`, clear),
			vscode.workspace.onDidChangeConfiguration((event) => {
				if (event.affectsConfiguration(HATS_SECTION)) {
					statusBar.refresh();
				}
			}),
		);

		// Re-apply the stored hat color in case the workspace dropped it on open.
		void reapplyStoredColor();
	} catch (error) {
		console.error('[Hats] activation failed:', error);
		void vscode.window.showErrorMessage(`Hats failed to activate: ${error}`);
	}
}

export function deactivate(): void {}

function registerCommand(
	id: string,
	handler: () => Promise<void>,
): vscode.Disposable {
	return vscode.commands.registerCommand(id, () => handler());
}
