// The Hats status bar button. Shows the workspace name (the active profile
// name is not exposed by any API yet) and switches profiles in one click.
// Color and template actions live in the Command Palette under "Hats:".

import * as vscode from 'vscode';
import { getShowWorkspaceName, getStatusBarAlignment } from './configService';

const SWITCH_COMMAND = 'hats-profile-switcher.switchProfile';

export class StatusBarView implements vscode.Disposable {
	private item!: vscode.StatusBarItem;

	constructor() {
		this.build();
	}

	/** Rebuild on alignment change, then refresh the dynamic label. */
	refresh(): void {
		if (this.item.alignment !== getStatusBarAlignment()) {
			this.item.dispose();
			this.build();
			return;
		}
		this.renderLabel();
	}

	dispose(): void {
		this.item.dispose();
	}

	private build(): void {
		this.item = vscode.window.createStatusBarItem(getStatusBarAlignment(), 100);
		this.item.command = SWITCH_COMMAND;
		this.item.tooltip = 'Hats: switch profile (color and more in the Command Palette)';
		this.renderLabel();
		this.item.show();
	}

	private renderLabel(): void {
		const label = getShowWorkspaceName() ? workspaceName() : 'Hats';
		this.item.text = `$(mortar-board) ${label}`;
	}
}

// TODO: show the active profile name here once VSCode exposes a profile API
// (https://github.com/microsoft/vscode/issues/226355).
function workspaceName(): string {
	return vscode.workspace.name ?? 'No Folder';
}
