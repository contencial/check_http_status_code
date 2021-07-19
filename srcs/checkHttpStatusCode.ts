function checkHttpStatusCode() {
	const START = new Date();

	const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
	const MAIN_SHEET = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Main');
	const SIZE_CELL = MAIN_SHEET.getRange('B1');
	const LIST_SIZE: int = SIZE_CELL.getValue();
	try {
		if (SIZE_CELL.isBlank() || typeof LIST_SIZE != 'number' || LIST_SIZE < 0)
			throw new Error('List Size Error: 取得数に誤りがあります。');
		const HTTP_CELL = MAIN_SHEET.getRange(3, 14, LIST_SIZE, 1).getValues();
		let index: int = 0;
		index = getIndexOfTargetCell(HTTP_CELL, LIST_SIZE, index);
		const DOMAIN_CELL = MAIN_SHEET.getRange(3, 5, LIST_SIZE, 1).getValues();
		while (index < LIST_SIZE) {
			const URL = `https://${DOMAIN_CELL[index][0]}`;
			let options = {
				muteHttpExceptions: true
			};
			let value: string;
			try {
				let response = UrlFetchApp.fetch(URL, options);
				value = response.getResponseCode();
			} catch (e) {
				err = e.message.split(':');
				value = err[0];
			}
			MAIN_SHEET.getRange(3 + index, 14).setValue(value);
			const NOW = new Date();
			const TIMESTAMP = `${NOW.getFullYear()}/${NOW.getMonth()+1}/${NOW.getDate()} ${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}`;
			MAIN_SHEET.getRange(3 + index, 15).setValue(TIMESTAMP);
			index++;
			if (HTTP_CELL[index][0]) {
				index = getIndexOfTargetCell(HTTP_CELL, LIST_SIZE, index);
			}

			let diff = NOW.getTime() - START.getTime();
			if (diff / 1000 > 270)
				break ;
		}
	} catch (e) {
		console.log(e.message);
	}
}

function getIndexOfTargetCell(HTTP_CELL: Array<Array<string>>, LIST_SIZE: int, index: int) {
	while (index < LIST_SIZE) {
		if (HTTP_CELL[index][0]) {
			index++;
		} else {
			console.log(`Start at index: ${index}`);
			break ;
		}
	}
	return index;
}
