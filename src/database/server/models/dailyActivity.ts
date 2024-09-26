import { sql } from 'drizzle-orm';

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
// 定义周的数据结构
interface WeekData {
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
// 定义周的数据结构
interface WeeksData {
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

  //Dashboard initial data retreive for the current year
  async getMonthlyActivitySummary(userId: string) {
    const currentYear = new Date().getFullYear();
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
      .where(
        sql`${dailyActivity.userId} = ${userId} AND EXTRACT(YEAR FROM ${dailyActivity.dateTime}) = ${currentYear}`,
      )
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
    // 判断是否有结果数据
    if (results.length === 0) {
      console.log('No data found for the Year');
      return activitySummary; // 如果没有获取到数据，返回初始化的结果
    }

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
  //Dashboard  data retreive for the selected  year
  async getMonthlyActivitySummaryByYear(userId: string, year: string) {
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
      .where(
        sql`${dailyActivity.userId} = ${userId} AND EXTRACT(YEAR FROM ${dailyActivity.dateTime}) = ${year}`, // 使用传递的字符串 year
      )
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
    const activitySummary: { [key: string]: any } = {};
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
    // 判断是否有结果数据
    if (results.length === 0) {
      console.log('No data found for the month');
      return activitySummary; // 如果没有获取到数据，返回初始化的结果
    }
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

    console.log(`Activity Summary for the year ${year} in model layer`, activitySummary);
    return activitySummary;
  }
  //Dashboard  data retreive for the selected  week
  async getWeeklyActivitySummaryByWeekString(userId: string, weekString: string) {
    // 解析 weekString，例如 '2024-36th'
    const [year, weekPart] = weekString.split('-');
    const weekNumber = parseInt(weekPart.replace('th', ''), 10); // 提取周数

    const firstDayOfYear = new Date(parseInt(year, 10), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const targetWeekStartDate = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + (weekNumber - 1) * 7 - dayOfWeek + 1),
    );
    const targetWeekEndDate = new Date(targetWeekStartDate);
    targetWeekEndDate.setDate(targetWeekEndDate.getDate() + 6);

    // 查询数据库，查找这周内的活动数据
    const results = await serverDB
      .select({
        // week: sql`EXTRACT(WEEK FROM ${dailyActivity.dateTime} AS week`,
        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
        date: sql`DATE(${dailyActivity.dateTime}) AS date`,
        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
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
      .where(
        sql`${dailyActivity.userId} = ${userId} AND ${dailyActivity.dateTime} >= ${targetWeekStartDate} AND ${dailyActivity.dateTime} < ${targetWeekEndDate}`,
      )
      .groupBy(sql`DATE(${dailyActivity.dateTime})`)

      .execute();

    // 初始化一周的数据
    const weekNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const activitySummary: { [key: string]: WeekData } = {};
    // 判断是否有结果数据
    if (results.length === 0) {
      console.log('No data found for the Week');
      return activitySummary; // 如果没有获取到数据，返回初始化的结果
    }
    weekNames.forEach((day) => {
      activitySummary[day] = {
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

    // 将结果分配给对应的星期
    results.forEach((result) => {
      let dayOfWeek: number;

      if (typeof result.date === 'string' || typeof result.date === 'number') {
        const date = new Date(result.date);
        dayOfWeek = date.getDay(); // 获取星期几
      } else {
        console.error('Invalid date format:', result.date);
        return; // 跳过无效的日期
      }

      // 获取活动的星期几
      const dayName = weekNames[dayOfWeek];

      if (dayName) {
        activitySummary[dayName].calories = result.total_calories || 0;
        activitySummary[dayName].distance = result.total_distance || 0;
        activitySummary[dayName].steps = result.total_steps || 0;
        activitySummary[dayName].lightlyActiveMinutes = result.total_lightlyActiveMinutes || 0;
        activitySummary[dayName].moderatelyActiveMinutes =
          result.total_moderatelyActiveMinutes || 0;
        activitySummary[dayName].sedentaryMinutes = result.total_sedentaryMinutes || 0;
        activitySummary[dayName].veryActiveMinutes = result.total_veryActiveMinutes || 0;
        activitySummary[dayName].minutesAsleep = result.total_minutesAsleep || 0;
        activitySummary[dayName].minutesAwake = result.total_minutesAwake || 0;
        activitySummary[dayName].timeInBed = result.total_timeInBed || 0;
      }
    });

    console.log(`Activity Summary for week ${weekString} in model layer`, activitySummary);
    return activitySummary;
  }
  //Dashboard  data retreive for the selected  month
  // async getMonthlyActivitySummaryByMonth(userId: string, monthString: string) {
  //   // 解析传入的 monthString，例如 '2024-01'
  //   const [year, month] = monthString.split('-');
  //   const targetMonthStartDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  //   const targetMonthEndDate = new Date(parseInt(year, 10), parseInt(month, 10), 0); // 月末日期

  //   // 查询数据库，查找该月份的活动数据
  //   const results = await serverDB
  //     .select({
  //       week: sql<number>`EXTRACT(WEEK FROM ${dailyActivity.dateTime}) AS week`,
  //       // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  //       dateTime: dailyActivity.dateTime,
  //       // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  //       total_calories: sql<number>`SUM(${dailyActivity.calories})`,
  //       total_distance: sql<number>`SUM(${dailyActivity.distance})`,
  //       total_lightlyActiveMinutes: sql<number>`SUM(${dailyActivity.lightlyActiveMinutes})`,
  //       total_minutesAsleep: sql<number>`SUM(${dailyActivity.minutesAsleep})`,
  //       total_minutesAwake: sql<number>`SUM(${dailyActivity.minutesAwake})`,
  //       total_moderatelyActiveMinutes: sql<number>`SUM(${dailyActivity.moderatelyActiveMinutes})`,
  //       total_sedentaryMinutes: sql<number>`SUM(${dailyActivity.sedentaryMinutes})`,
  //       total_steps: sql<number>`SUM(${dailyActivity.steps})`,
  //       total_timeInBed: sql<number>`SUM(${dailyActivity.timeInBed})`,
  //       total_veryActiveMinutes: sql<number>`SUM(${dailyActivity.veryActiveMinutes})`,
  //     })
  //     .from(dailyActivity)
  //     .where(
  //       sql`${dailyActivity.userId} = ${userId} AND ${dailyActivity.dateTime} >= ${targetMonthStartDate} AND ${dailyActivity.dateTime} <= ${targetMonthEndDate}`,
  //     )
  //     .groupBy(sql`EXTRACT(WEEK FROM ${dailyActivity.dateTime})`)
  //     .execute();

  //   // 初始化四周的数据
  //   const weeksName = ['Week1', 'Week2', 'Week3', 'Week4'];
  //   const activitySummary: { [key: string]: WeeksData } = {};
  //   weeksName.forEach((week) => {
  //     activitySummary[week] = {
  //       calories: 0,
  //       distance: 0,
  //       lightlyActiveMinutes: 0,
  //       minutesAsleep: 0,
  //       minutesAwake: 0,
  //       moderatelyActiveMinutes: 0,
  //       sedentaryMinutes: 0,
  //       steps: 0,
  //       timeInBed: 0,
  //       veryActiveMinutes: 0,
  //     };
  //   });

  //   // 判断是否有结果数据
  //   if (results.length === 0) {
  //     console.log('No data found for the month', monthString);
  //     return activitySummary; // 如果没有获取到数据，返回初始化的结果
  //   }

  //   // 将结果分配给对应的周
  //   results.forEach((result) => {
  //     const weekIndex = result.week - 1; // 获取周数
  //     const weekName = weeksName[weekIndex];

  //     if (weekName) {
  //       activitySummary[weekName].calories = result.total_calories || 0;
  //       activitySummary[weekName].distance = result.total_distance || 0;
  //       activitySummary[weekName].steps = result.total_steps || 0;
  //       activitySummary[weekName].lightlyActiveMinutes = result.total_lightlyActiveMinutes || 0;
  //       activitySummary[weekName].moderatelyActiveMinutes =
  //         result.total_moderatelyActiveMinutes || 0;
  //       activitySummary[weekName].sedentaryMinutes = result.total_sedentaryMinutes || 0;
  //       activitySummary[weekName].veryActiveMinutes = result.total_veryActiveMinutes || 0;
  //       activitySummary[weekName].minutesAsleep = result.total_minutesAsleep || 0;
  //       activitySummary[weekName].minutesAwake = result.total_minutesAwake || 0;
  //       activitySummary[weekName].timeInBed = result.total_timeInBed || 0;
  //     }
  //   });

  //   console.log(`Activity Summary for the month ${monthString}`, activitySummary);
  //   return activitySummary;
  // }
  async getMonthlyActivitySummaryByMonth(userId: string, monthString: string) {
    // 解析传入的 monthString，例如 '2024-01'
    const [year, month] = monthString.split('-');
    const targetMonthStartDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const targetMonthEndDate = new Date(parseInt(year, 10), parseInt(month, 10), 0); // 月末日期

    // 查询数据库，查找该月份的活动数据
    const results = await serverDB
      .select({
        week: sql<number>`
          CASE
            WHEN EXTRACT(DAY FROM ${dailyActivity.dateTime}) BETWEEN 1 AND 7 THEN 1
            WHEN EXTRACT(DAY FROM ${dailyActivity.dateTime}) BETWEEN 8 AND 14 THEN 2
            WHEN EXTRACT(DAY FROM ${dailyActivity.dateTime}) BETWEEN 15 AND 21 THEN 3
            ELSE 4
          END AS week
        `, // 按月内的第几周分类

        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
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
      .where(
        sql`${dailyActivity.userId} = ${userId} AND ${dailyActivity.dateTime} >= ${targetMonthStartDate} AND ${dailyActivity.dateTime} <= ${targetMonthEndDate}`,
      )
      .groupBy(sql`EXTRACT(DAY FROM ${dailyActivity.dateTime})`)
      .execute();

    // 初始化四周的数据
    const weeksName = ['Week1', 'Week2', 'Week3', 'Week4'];
    const activitySummary: { [key: string]: WeeksData } = {};
    weeksName.forEach((week) => {
      activitySummary[week] = {
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

    // 判断是否有结果数据
    if (results.length === 0) {
      console.log('No data found for the month', monthString);
      return activitySummary; // 如果没有获取到数据，返回初始化的结果
    }

    // 将结果分配给对应的周
    results.forEach((result) => {
      const weekIndex = result.week - 1; // 获取周数
      const weekName = weeksName[weekIndex];

      if (weekName) {
        activitySummary[weekName].calories = result.total_calories || 0;
        activitySummary[weekName].distance = result.total_distance || 0;
        activitySummary[weekName].steps = result.total_steps || 0;
        activitySummary[weekName].lightlyActiveMinutes = result.total_lightlyActiveMinutes || 0;
        activitySummary[weekName].moderatelyActiveMinutes =
          result.total_moderatelyActiveMinutes || 0;
        activitySummary[weekName].sedentaryMinutes = result.total_sedentaryMinutes || 0;
        activitySummary[weekName].veryActiveMinutes = result.total_veryActiveMinutes || 0;
        activitySummary[weekName].minutesAsleep = result.total_minutesAsleep || 0;
        activitySummary[weekName].minutesAwake = result.total_minutesAwake || 0;
        activitySummary[weekName].timeInBed = result.total_timeInBed || 0;
      }
    });

    console.log(`Activity Summary for the month ${monthString}`, activitySummary);
    return activitySummary;
  }
}
