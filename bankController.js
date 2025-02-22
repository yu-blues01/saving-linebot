// 銀行操作コントローラー
class BankController {
  constructor(userId) {
    this.spreadsheetService = new SpreadsheetService(userId);
  }

  handleIncome(amount) {
    const currentBalance = this.spreadsheetService.getLastBalance();
    const newBalance = currentBalance + amount;
    this.spreadsheetService.recordTransaction(
      DateUtil.getCurrentDateArray(),
      amount,
      0,
      newBalance
    );
    return `入金の登録ですね！\n\n${amount} 円の入金を登録しました！`;
  }

  handleOutcome(amount) {
    const currentBalance = this.spreadsheetService.getLastBalance();
    const newBalance = currentBalance - amount;
    this.spreadsheetService.recordTransaction(
      DateUtil.getCurrentDateArray(),
      0,
      amount,
      newBalance
    );
    return `出金の登録ですね！\n\n${amount} 円の出金を登録しました！`;
  }

  handleMonthlyIncome(amount) {
    const dateArray = DateUtil.getCurrentDateArray();
    const daysInMonth = DateUtil.getDaysInMonth(dateArray[0], dateArray[1]);
    const dailyBonus = (amount * 0.8) / daysInMonth;
    
    this.spreadsheetService.updateDailyBonus(amount, dailyBonus);
    return `今月の給与所得\n${amount} 円を登録しました！`;
  }

  getBalance() {
    const balance = this.spreadsheetService.getLastBalance();
    return `残高照会ですね！\n少々お待ち下さい…\n\n現在の残高は ${balance} 円です。`;
  }
}