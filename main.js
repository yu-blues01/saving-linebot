function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  if (!replyToken) return;

  const userMessage = event.message.text;
  const bankController = new BankController(userId);
  let responseMessage;
  try {
    if (userMessage.startsWith('M')) {
      const amount = parseInt(userMessage.slice(1));
      responseMessage = bankController.handleMonthlyIncome(amount);
    } else if (userMessage.startsWith('+')) {
      const amount = parseInt(userMessage.slice(1));
      responseMessage = bankController.handleIncome(amount);
    } else if (userMessage.startsWith('-')) {
      const amount = parseInt(userMessage.slice(1));
      responseMessage = bankController.handleOutcome(amount);
    } else if (userMessage === '残高') {
      responseMessage = bankController.getBalance();
    } else {
      responseMessage = getHelpMessage();
    }

    LineService.replyMessage(replyToken, [{
      type: 'text',
      text: responseMessage
    }]);

  } catch (error) {
    LineService.replyMessage(replyToken, [{
      type: 'text',
      text: '申し訳ありません。エラーが発生しました。'
    }]);
  }
}

function getHelpMessage() {
  return `こんにちは！\nこのbotには以下の4つの機能があります！\n\n
【機能】          【コマンド】
入金の登録  ：  +入金金額（半角数字）
出金の登録  ：  -出金金額（半角数字）
残高照会      ：  残高
給与登録      ：  M給与金額（半角数字）\n
ご要望に合わせたコマンドを送ってみてくださいね！`;
}

// 毎朝8時に実行する日次ボーナス付与関数
function addDailyBonus() {
  // ユーザー管理シートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET.URL);
  const userSheet = spreadsheet.getSheetByName('ユーザー管理');
  if (!userSheet) return;

  // すべてのユーザーデータを取得
  const userData = userSheet.getDataRange().getValues();
  // ヘッダー行をスキップ
  for (let i = 1; i < userData.length; i++) {
    const userId = userData[i][0];
    const bankController = new BankController(userId);
    const spreadsheetService = new SpreadsheetService(userId);

    // Income per Dayの値を取得
    const dailyBonus = spreadsheetService.userDataSheet.getRange(1, 4).getValue();
    if (!dailyBonus) continue;

    // 整数に変換
    const bonusAmount = Math.floor(dailyBonus);
    if (bonusAmount <= 0) continue;

    // 残高に追加
    bankController.handleIncome(bonusAmount);

    // 更新後の残高を取得
    const currentBalance = spreadsheetService.getLastBalance();

    // LINEで通知
    LineService.sendPushMessage(
      `    ✨Login Bonus✨  \n     
🎊きょうもいきててえらい!!🎉\n
       🎁： ${bonusAmount}\n
 現在の貯金額： ${currentBalance}  円`
    );
  }
}

// 毎月25日に実行する給与登録リマインド関数
function remindSalaryRegistration() {
  // ユーザー管理シートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET.URL);
  const userSheet = spreadsheet.getSheetByName('ユーザー管理');
  if (!userSheet) return;

  // すべてのユーザーデータを取得
  const userData = userSheet.getDataRange().getValues();
  // ヘッダー行をスキップ
  for (let i = 1; i < userData.length; i++) {
    const userId = userData[i][0];
    
    // リマインドメッセージを送信
    const message = 
      "今月の給与情報を登録する時期になりました！\n" +
      "「M」の後に給与金額（半角数字）を入力して送信してください。\n" +
      "例：M250000";
    
    LineService.sendPushMessage(message);
  }
}