// The Hats status bar UI: a main button that switches profiles in one click,
// plus a small gear next to it for the less frequent color/template actions.
//
// The main button shows the workspace name (the active profile name is not
// exposed by any API yet) and triggers the native profile switcher directly.

import * as vscode from 'vscode';
import { getShowWorkspaceName, getStatusBarAlignment } from './configService';

const SWITCH_COMMAND = 'hats-profile-switcher.switchProfile';
const MENU_COMMAND = 'hats-profile-switcher.openMenu';

export class StatusBarView implements vscode.Disposable {
	private main!: vscode.StatusBarItem;
	private options!: vscode.StatusBarItem;

	constructor() {
		this.build();
	}

	/** Rebuild on alignment change, then refresh the dynamic label. */
	refresh(): void {
		if (this.main.alignment !== getStatusBarAlignment()) {
			this.dispose();
			this.build();
			return;
		}
		this.renderLabel();
	}

	dispose(): void {
		this.main.dispose();
		this.options.dispose();
	}

	private build(): void {
		// Higher priority renders further to the left, so the main button sits
		// just left of the gear.
		this.main = this.create(101);
		this.main.command = SWITCH_COMMAND;
		this.main.tooltip = 'Hats: switch profile';

		this.options = this.create(100);
		this.options.command = MENU_COMMAND;
		this.options.text = '$(gear)';
		this.options.tooltip = 'Hats: window color and profile options';

		this.renderLabel();
		this.main.show();
		this.options.show();
	}

	private create(priority: number): vscode.StatusBarItem {
		return vscode.window.createStatusBarItem(getStatusBarAlignment(), priority);
	}

	private renderLabel(): void {
		const label = getShowWorkspaceName() ? workspaceName() : 'Hats';
		this.main.text = `$(mortar-board) ${label}`;
	}
}

// TODO: show the active profile name here once VSCode exposes a profile API
// (https://github.com/microsoft/vscode/issues/226355).
function workspaceName(): string {
	return vscode.workspace.name ?? 'No Folder';
}
