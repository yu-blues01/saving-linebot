// スプレッドシート操作クラス
class SpreadsheetService {
  constructor(userId) {
    this.spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET.URL);
    this.userSheet = this.spreadsheet.getSheetByName('ユーザー管理');
    if (!this.userSheet) {
      this.userSheet = this.createUserManagementSheet();
    }
    this.userDataSheet = this.getOrCreateUserSheet(userId);
  }

  createUserManagementSheet() {
    const sheet = this.spreadsheet.insertSheet('ユーザー管理');
    sheet.getRange(1, 1, 1, 2).setValues([['ユーザーID', 'シート名']]);
    return sheet;
  }

  getOrCreateUserSheet(userId) {
    const userData = this.findUserData(userId);
    if (userData) {
      return this.spreadsheet.getSheetByName(userData.sheetName);
    }

    const newSheetName = `user_${userId}_${Date.now()}`;
    const newSheet = this.spreadsheet.insertSheet(newSheetName);
    this.initializeUserSheet(newSheet);
    this.registerUser(userId, newSheetName);
    return newSheet;
  }

  findUserData(userId) {
    const data = this.userSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        return { sheetName: data[i][1] };
      }
    }
    return null;
  }

  registerUser(userId, sheetName) {
    const lastRow = this.userSheet.getLastRow();
    this.userSheet.getRange(lastRow + 1, 1, 1, 2).setValues([[userId, sheetName]]);
  }

  initializeUserSheet(sheet) {
    // 1行目: 給与情報
    sheet.getRange(1, 1, 1, 4).setValues([
      ['This Month Income :', 0, 'Income per Day :', 0]
    ]);

    // 3行目: ヘッダー
    sheet.getRange(3, 1, 1, 9).setValues([
      ['year', 'month', 'day', 'time', 'minute', 'second', 'deposit', 'withdraw', 'balance']
    ]);

    // 初期データを4行目に追加（現在の日時で0円の取引を記録）
    const dateArray = DateUtil.getCurrentDateArray();
    sheet.getRange(4, 1, 1, 9).setValues([
      [...dateArray, 0, 0, 0] // 初期残高0円で設定
    ]);
  }

  getLastBalance() {
    const lastRow = this.userDataSheet.getLastRow();
    if (lastRow <= 3) {
      return 0; // データがない場合は0を返す
    }
    const balance = this.userDataSheet.getRange(lastRow, 9).getValue();
    return balance || 0; // nullやundefinedの場合は0を返す
  }

  recordTransaction(dateArray, income, outcome, newBalance) {
    const lastRow = this.userDataSheet.getLastRow();
    if (lastRow < 4) {
      // データが無い場合は4行目から開始
      this.userDataSheet.getRange(4, 1, 1, 9).setValues([
        [...dateArray, income, outcome, newBalance]
      ]);
    } else {
      this.userDataSheet.getRange(lastRow + 1, 1, 1, 9).setValues([
        [...dateArray, income, outcome, newBalance]
      ]);
    }
  }

  updateDailyBonus(monthlyIncome, dailyBonus) {
    this.userDataSheet.getRange(1, 2, 1, 3).setValues([
      [monthlyIncome, 'Income per Day :', dailyBonus]
    ]);
  }

}