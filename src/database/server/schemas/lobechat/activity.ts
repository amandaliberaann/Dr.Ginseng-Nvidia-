/* eslint-disable sort-keys-fix/sort-keys-fix  */
// import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';
import {
  // boolean,
  doublePrecision,
  integer, // jsonb,
  pgTable, // primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core';

import { createdAt, timestamptz, updatedAt } from './_helpers';

export const dailyActivity = pgTable('daily_activity', {
  id: serial('id').primaryKey(), // 自增ID
  dateTime: timestamptz('datetime').notNull(), // 时间戳字段
  steps: integer('steps'), // 步数
  calories: doublePrecision('calories'), // 卡路里，保留小数
  distance: doublePrecision('distance'), // 距离，保留小数
  veryActiveMinutes: integer('very_active_minutes'), // 高强度活动时间
  lightlyActiveMinutes: integer('lightly_active_minutes'), // 轻度活动时间
  moderatelyActiveMinutes: integer('moderately_active_minutes'), // 中等强度活动时间
  sedentaryMinutes: integer('sedentary_minutes'), // 静坐时间
  duration: doublePrecision('duration'), // 持续时间，保留小数
  minutesToFallAsleep: doublePrecision('minutestofallasleep'), // 入睡时间
  minutesAsleep: integer('minutesasleep'), // 睡眠时间
  minutesAwake: doublePrecision('minutesawake'), // 醒来时间
  minutesAfterWakeup: doublePrecision('minutesafterwakeup'), // 醒后时间
  timeInBed: doublePrecision('timeinbed'), // 床上时间
  efficiency: doublePrecision('efficiency'), // 睡眠效率
  type: text('type'), // 类型
  infoCode: doublePrecision('info_code'), // 信息代码
  mainSleep: integer('mainsleep'), // 是否为主要睡眠
  userId: text('user_id'), // 用户
  gender: text('gender'), // 性别
  height: doublePrecision('height'), // 身高
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type NewActivity = typeof dailyActivity.$inferInsert;
export type ActivityItem = typeof dailyActivity.$inferSelect;
