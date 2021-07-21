function deleteAddressUnavailable() {
	const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
	const MAIN_SHEET = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Main');
	const SIZE_CELL = MAIN_SHEET.getRange('B1');
	const LIST_SIZE: int = SIZE_CELL.getValue();
	try {
		if (SIZE_CELL.isBlank() || typeof LIST_SIZE != 'number' || LIST_SIZE < 0)
			throw new Error('List Size Error: 取得数に誤りがあります。');
		const HTTP_CELL = MAIN_SHEET.getRange(3, 9, LIST_SIZE, 1).getValues();
		let index: int = 0;
		while (index < LIST_SIZE) {
			if (/Address unavailable|使用できないアドレス/.test(HTTP_CELL[index][0])) {
				MAIN_SHEET.getRange(`I${3 + index}`).clearContent();
			}
			index++;
		}
	} catch (e) {
		console.log(e.message);
	}
}
