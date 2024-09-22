// import { TRPCError } from '@trpc/server';
// import { DeepPartial } from 'utility-types';
// import { UserNotFoundError } from '@/database/server/models/user';
// import { KeyVaultsGateKeeper } from '../../../server/modules/KeyVaultsEncrypt';
// import { keyVaultsSettings } from './../../../store/user/slices/modelList/selectors/keyVaults';
// import { SessionModel } from './session';
import { eq, sql } from 'drizzle-orm';

import { serverDB } from '../../server/core/db';
import { NewActivity, dailyActivity } from '../schemas/lobechat';

// 定义每个月的数据结构
interface MonthData {
  calories: number;
  distance: number;
  lightlyActiveMinutes: number;
  minutesAsleep: number;
  minutesAwake: number;
  moderatelyActiveMinutes: number;
  sedentaryMinutes: number;
  steps: number;
  timeInBed: number;
  veryActiveMinutes: number;
}

// 定义 activitySummary 对象的类型
const activitySummary: Record<string, MonthData> = {};
export class ActivityModel {
  createDailyActivity = async (params: NewActivity) => {
    const [activity] = await serverDB
      .insert(dailyActivity)
      .values({ ...params })
      .returning();
    return activity;
  };
  async getMonthlyActivitySummary(userId: string) {
    const results = await serverDB
      .select({
        month: sql`EXTRACT(MONTH FROM ${dailyActivity.dateTime}) AS month`,
        total_calories: sql<number>`SUM(${dailyActivity.calories})`,
        total_distance: sql<number>`SUM(${dailyActivity.distance})`,
        total_lightlyActiveMinutes: sql<number>`SUM(${dailyActivity.lightlyActiveMinutes})`,
        total_minutesAsleep: sql<number>`SUM(${dailyActivity.minutesAsleep})`,
        total_minutesAwake: sql<number>`SUM(${dailyActivity.minutesAwake})`,
        total_moderatelyActiveMinutes: sql<number>`SUM(${dailyActivity.moderatelyActiveMinutes})`,
        total_sedentaryMinutes: sql<number>`SUM(${dailyActivity.sedentaryMinutes})`,
        total_steps: sql<number>`SUM(${dailyActivity.steps})`,
        total_timeInBed: sql<number>`SUM(${dailyActivity.timeInBed})`,
        total_veryActiveMinutes: sql<number>`SUM(${dailyActivity.veryActiveMinutes})`,
      })
      .from(dailyActivity)
      .where(eq(dailyActivity.userId, userId))
      .groupBy(sql`EXTRACT(MONTH FROM ${dailyActivity.dateTime})`)
      .execute();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // 初始化所有月份的活动数据
    monthNames.forEach((month) => {
      activitySummary[month] = {
        calories: 0,
        distance: 0,
        lightlyActiveMinutes: 0,
        minutesAsleep: 0,
        minutesAwake: 0,
        moderatelyActiveMinutes: 0,
        sedentaryMinutes: 0,
        steps: 0,
        timeInBed: 0,
        veryActiveMinutes: 0,
      };
    });

    results.forEach((result) => {
      if (typeof result.month === 'string' && result.month.trim() !== '') {
        const monthIndex = parseInt(result.month.trim()) - 1;
        if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < monthNames.length) {
          const monthName = monthNames[monthIndex];
          activitySummary[monthName].calories = result.total_calories || 0;
          activitySummary[monthName].distance = result.total_distance || 0;
          activitySummary[monthName].steps = result.total_steps || 0;
          activitySummary[monthName].lightlyActiveMinutes = result.total_lightlyActiveMinutes || 0;
          activitySummary[monthName].moderatelyActiveMinutes =
            result.total_moderatelyActiveMinutes || 0;
          activitySummary[monthName].sedentaryMinutes = result.total_sedentaryMinutes || 0;
          activitySummary[monthName].veryActiveMinutes = result.total_veryActiveMinutes || 0;
          activitySummary[monthName].minutesAsleep = result.total_minutesAsleep || 0;
          activitySummary[monthName].minutesAwake = result.total_minutesAwake || 0;
          activitySummary[monthName].timeInBed = result.total_timeInBed || 0;
        }
      }
    });

    console.log('Activity Summary in model layer', activitySummary);
    return activitySummary;
  }

  // async getMonthlyActivitySummary(userId: string) {
  //   const results = await serverDB
  //     .select({
  //       month: sql`EXTRACT(MONTH FROM ${dailyActivity.dateTime}) AS month`,
  //       total_calories: sql<number>`SUM(${dailyActivity.calories})`,
  //       total_distance: sql<number>`SUM(${dailyActivity.distance})`,
  //       total_steps: sql<number>`SUM(${dailyActivity.steps})`,
  //     })
  //     .from(dailyActivity)
  //     .where(eq(dailyActivity.userId, userId))
  //     .groupBy(sql`EXTRACT(MONTH FROM ${dailyActivity.dateTime})`)
  //     .execute();

  //   const monthNames = [
  //     'Jan',
  //     'Feb',
  //     'Mar',
  //     'Apr',
  //     'May',
  //     'Jun',
  //     'Jul',
  //     'Aug',
  //     'Sep',
  //     'Oct',
  //     'Nov',
  //     'Dec',
  //   ];

  //   monthNames.forEach((month) => {
  //     activitySummary[month] = { calories: 0, distance: 0, steps: 0 };
  //   });

  //   // 假设 results 是从数据库或其他数据源获取的
  //   results.forEach((result) => {
  //     // 检查 result.month 是否为有效字符串
  //     if (typeof result.month === 'string' && result.month.trim() !== '') {
  //       // 解析月份并调整为数组索引（0-11）
  //       const monthIndex = parseInt(result.month.trim()) - 1;

  //       // 检查解析是否成功（不是 NaN）且索引在有效范围内
  //       if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < monthNames.length) {
  //         const monthName = monthNames[monthIndex]; // 使用安全的索引访问 monthNames

  //         // 更新 activitySummary 对应的月份数据
  //         activitySummary[monthName].steps = result.total_steps || 0;
  //         activitySummary[monthName].calories = result.total_calories || 0;
  //         activitySummary[monthName].distance = result.total_distance || 0;
  //       } else {
  //         console.error('Invalid month index derived from result.month:', result.month);
  //       }
  //     } else {
  //       console.error('Invalid or missing month value:', result.month);
  //     }
  //   });
  //   console.log('Activity Summary in model layer', activitySummary);
  //   return activitySummary;
  // }
}
