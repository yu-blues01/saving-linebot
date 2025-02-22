// 日付ユーティリティ
class DateUtil {
  static getCurrentDateArray() {
    const now = new Date();
    return [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ];
  }

  static getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
}