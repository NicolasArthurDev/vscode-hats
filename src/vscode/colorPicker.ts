// The window-color picker, invoked from the "Hats: Set Window Color" command.
// Offers the configured palette plus a custom hex entry.

import * as vscode from 'vscode';
import { Hat, isHexColor } from '../core/palette';
import { getPalette } from './configService';
import { apply } from './colorStore';

/** Pick a hat from the palette, or enter a custom hex color. */
export async function pickColor(): Promise<void> {
	const picked = await vscode.window.showQuickPick(paletteItems(getPalette()), {
		title: 'Set window color',
		placeHolder: 'Pick a hat or enter a custom color',
	});
	if (!picked) {
		return;
	}
	const color = picked.color ?? (await promptForHex());
	if (color) {
		await apply(color);
	}
}

interface ColorItem extends vscode.QuickPickItem {
	/** Undefined for the "custom hex" entry. */
	color?: string;
}

function paletteItems(palette: readonly Hat[]): ColorItem[] {
	const hats: ColorItem[] = palette.map((hat) => ({
		label: `$(circle-filled) ${hat.name}`,
		description: hat.color,
		color: hat.color,
	}));
	return [...hats, { label: '$(pencil) Custom hex…' }];
}

async function promptForHex(): Promise<string | undefined> {
	return vscode.window.showInputBox({
		title: 'Custom hat color',
		prompt: 'Enter a #rrggbb hex color',
		placeHolder: '#3178c6',
		validateInput: (value) =>
			isHexColor(value) ? undefined : 'Use a #rrggbb hex color',
	});
}
