// The QuickPick hub opened from the status bar button. It routes to profile
// actions and to the window-color picker.

import * as vscode from 'vscode';
import { Hat, isHexColor } from '../core/palette';
import { getPalette } from './configService';
import { apply, clear } from './colorStore';
import { createProfileFromTemplate, switchProfile } from './profileService';

interface Action extends vscode.QuickPickItem {
	run: () => Promise<void>;
}

/** Show the main Hats menu. */
export async function openMenu(): Promise<void> {
	const actions: Action[] = [
		{
			label: '$(arrow-swap) Switch profile…',
			detail: 'Open the native profile switcher',
			run: switchProfile,
		},
		{
			label: '$(add) New profile from template…',
			detail: 'Python, Java General, Java Spring, Node.js, …',
			run: createProfileFromTemplate,
		},
		{
			label: '$(paintcan) Set window color…',
			detail: 'Tint this workspace with a hat color',
			run: pickColor,
		},
		{
			label: '$(clear-all) Clear window color',
			detail: 'Remove the Hats tint from this workspace',
			run: clear,
		},
	];

	const picked = await vscode.window.showQuickPick(actions, {
		title: 'Hats',
		placeHolder: 'Choose a hat action',
	});
	await picked?.run();
}

/** Pick a hat from the palette, or enter a custom hex color. */
export async function pickColor(): Promise<void> {
	const palette = getPalette();
	const items = paletteItems(palette);
	const picked = await vscode.window.showQuickPick(items, {
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
