function clearHttpStatusCode() {
	try {
		const SPREADSHEET_ID: string = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
		const MAIN_SHEET: Sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Main');
		const LAST_ROW = MAIN_SHEET.getLastRow();
		MAIN_SHEET.getRange(`I3:J${LAST_ROW}`).clearContent();
	} catch (e) {
		console.log(e.message);
	}
}
