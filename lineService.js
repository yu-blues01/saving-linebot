// LINE API操作クラス
class LineService {
  static sendPushMessage(message) {
    const payload = {
      to: CONFIG.LINE.USER_ID,
      messages: [{ type: 'text', text: message }]
    };

    const params = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${CONFIG.LINE.CHANNEL_TOKEN}`
      },
      payload: JSON.stringify(payload)
    };

    return UrlFetchApp.fetch(`${CONFIG.LINE.API_URL}/push`, params);
  }

  static replyMessage(replyToken, messages) {
    const params = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${CONFIG.LINE.CHANNEL_TOKEN}`
      },
      payload: JSON.stringify({
        replyToken: replyToken,
        messages: messages
      })
    };

    return UrlFetchApp.fetch(`${CONFIG.LINE.API_URL}/reply`, params);
  }
}