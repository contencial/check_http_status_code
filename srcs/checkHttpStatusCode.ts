function checkHttpStatusCode() {
	const START = new Date();

	const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
	const MAIN_SHEET = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Main');
	const SIZE_CELL = MAIN_SHEET.getRange('B1');
	const LIST_SIZE: int = SIZE_CELL.getValue();
	try {
		if (SIZE_CELL.isBlank() || typeof LIST_SIZE != 'number' || LIST_SIZE < 0)
			throw new Error('List Size Error: 取得数に誤りがあります。');
		const DOMAIN_INFO = MAIN_SHEET.getRange(3, 5, LIST_SIZE, 5).getValues();
		DOMAIN_INFO.forEach(function(data, index) {
			if (data[4]) {
				return ;
			}
			if (data[1] == false || data[2] == false || data[3] == false) {
				MAIN_SHEET.getRange(3 + index, 9).setValue('-');
				return ;
			}
			const URL = `https://${data[0]}`;
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
			MAIN_SHEET.getRange(3 + index, 9).setValue(value);
			const NOW = new Date();
			const TIMESTAMP = `${NOW.getFullYear()}/${NOW.getMonth()+1}/${NOW.getDate()} ${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}`;
			MAIN_SHEET.getRange(3 + index, 10).setValue(TIMESTAMP);

			let diff = NOW.getTime() - START.getTime();
			if (diff / 1000 > 270)
				throw new Error('checkHttpStatusCode: Timeout 5 min') ;
		});
	} catch (e) {
		console.log(e.message);
	}
}
