import { EventEmitter } from 'node:events';

import { Injectable } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

export type PushNotification = {
  title: string;
  body: string;
  data?: {
    [key: string]: any;
  };
};

@Injectable()
export class PushNotificationsService {
  protected readonly _expo = new Expo();
  private readonly nodeEventEmitter = new EventEmitter();

  private readonly tokenRegex = /ExponentPushToken\[[^\]]+\]/;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.nodeEventEmitter.on('processExpoReceipts', (receiptIds: string[]) => {
      void this.processReceipts(receiptIds);
    });
  }

  private async sendPreparedMessages(
    chunks: ExpoPushMessage[][],
  ): Promise<void> {
    const receiptIds: string[] = [];
    const badTokens: string[] = [];
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this._expo.sendPushNotificationsAsync(chunk);
        for (const ticket of ticketChunk) {
          if (ticket?.status === 'ok') {
            receiptIds.push(ticket.id);
            continue;
          }
          if (ticket?.details?.error !== 'DeviceNotRegistered') {
            continue;
          }
          const match = ticket.message.match(this.tokenRegex);
          if (match) {
            const token = match[0];
            badTokens.push(token);
          }
        }

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }

    if (receiptIds.length > 0) {
      this.nodeEventEmitter.emit('processExpoReceipts', receiptIds);
    }
  }

  private async processReceipts(receiptIds: string[]): Promise<void> {
    const badTokens: string[] = [];

    const receiptIdChunks =
      this._expo.chunkPushNotificationReceiptIds(receiptIds);
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (const chunk of receiptIdChunks) {
      try {
        const receipts =
          await this._expo.getPushNotificationReceiptsAsync(chunk);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (const receiptId in receipts) {
          const receipt = receipts[receiptId];
          if (receipt.status === 'ok') {
            continue;
          }
          if (receipt.details?.error !== 'DeviceNotRegistered') {
            continue;
          }

          const match = receipt.message.match(this.tokenRegex);
          if (match) {
            const token = match[0];
            badTokens.push(token);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async sendPushNotification(
    deviceTokens: string[],
    title: string,
    body: string,
    data?: PushNotification['data'],
  ): Promise<void> {
    // Check that all your push tokens appear to be valid Expo push tokens
    const invalidTokens: string[] = [];
    const messages: ExpoPushMessage[] = [];

    deviceTokens.forEach((deviceToken) => {
      if (!Expo.isExpoPushToken(deviceToken)) {
        invalidTokens.push(deviceToken);
        return;
      }
      messages.push({
        to: deviceToken,
        sound: 'default',
        title,
        body,
        data,
      });
    });

    if (invalidTokens.length > 0) {
      // await this.deviceService.removeDevicesByToken(invalidTokens);
    }

    const chunks = this._expo.chunkPushNotifications(messages);

    await this.sendPreparedMessages(chunks);
  }
}
