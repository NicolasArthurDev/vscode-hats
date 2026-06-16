// VSCode profiles each carry their own extension set, so a newly created
// profile will not include Hats. There is no API to add an extension to every
// profile automatically, so we show a one-time tip pointing at the native
// "Apply Extension to all Profiles" action.

import * as vscode from 'vscode';

const HINT_KEY = 'hats.allProfilesHintShown';
const DOCS_URL = 'https://code.visualstudio.com/docs/configure/profiles';

export async function maybeShowAllProfilesHint(
	context: vscode.ExtensionContext,
): Promise<void> {
	if (context.globalState.get<boolean>(HINT_KEY)) {
		return;
	}
	await context.globalState.update(HINT_KEY, true);

	const learnMore = 'Learn how';
	const choice = await vscode.window.showInformationMessage(
		'Hats: to keep this button in every profile, use "Apply Extension to all ' +
			'Profiles" from the Extensions view gear menu.',
		learnMore,
	);
	if (choice === learnMore) {
		await vscode.env.openExternal(vscode.Uri.parse(DOCS_URL));
	}
}
