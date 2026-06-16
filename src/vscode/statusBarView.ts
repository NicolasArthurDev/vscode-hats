// The Hats status bar button. Shows the workspace name (the active profile
// name is not exposed by any API yet) and opens the Hats menu on click.

import * as vscode from 'vscode';
import { getShowWorkspaceName, getStatusBarAlignment } from './configService';

const OPEN_MENU_COMMAND = 'hats-profile-switcher.openMenu';

export class StatusBarView implements vscode.Disposable {
	private item: vscode.StatusBarItem;

	constructor() {
		this.item = this.create();
		this.render();
		this.item.show();
	}

	/** Rebuild the item when alignment changes, then re-render. */
	refresh(): void {
		const desired = getStatusBarAlignment();
		if (this.item.alignment !== desired) {
			this.item.dispose();
			this.item = this.create();
			this.item.show();
		}
		this.render();
	}

	dispose(): void {
		this.item.dispose();
	}

	private create(): vscode.StatusBarItem {
		// A high priority keeps the button near the corner edge.
		return vscode.window.createStatusBarItem(getStatusBarAlignment(), 100);
	}

	private render(): void {
		const label = getShowWorkspaceName() ? workspaceName() : 'Hats';
		this.item.text = `Hats: ${label}`;
		this.item.tooltip = 'Hats: switch profile or set the window color';
		this.item.command = OPEN_MENU_COMMAND;
	}
}

// TODO: show the active profile name here once VSCode exposes a profile API
// (https://github.com/microsoft/vscode/issues/226355).
function workspaceName(): string {
	return vscode.workspace.name ?? 'No Folder';
}
