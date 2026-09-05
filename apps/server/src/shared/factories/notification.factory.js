export class NotificationFactory {
  static createNotification(type, payload) {
    return {
      type,
      payload,
      timestamp: new Date(),
    };
  }
}
