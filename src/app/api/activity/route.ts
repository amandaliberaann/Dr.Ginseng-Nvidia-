// src/pages/api/activity/route.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

import { ActivityService } from './../../../server/services/activity/index';

//Define the structure for monthly activity data
interface MonthlyData {
  // 允许使用任何字符串作为键，值为 number 类型
  [key: string]: number;
  Apr: number;
  Aug: number;
  Dec: number;
  Feb: number;
  Jan: number;
  Jul: number;
  Jun: number;
  Mar: number;
  May: number;
  Nov: number;
  Oct: number;
  Sep: number;
}
interface DayData {
  // 允许使用任何字符串作为键，值为 number 类型
  [key: string]: number;
  Fri: number;
  Mon: number;
  Sat: number;
  Sun: number;
  Thur: number;
  Tue: number;
  Wed: number;
}
interface WeekData {
  // 允许使用任何字符串作为键，值为 number 类型
  [key: string]: number;
  Week1: number;
  Week2: number;
  Week3: number;
  Week4: number;
}

// Define the structure for the comprehensive activity data
interface ActivityData {
  calories: MonthlyData;
  distance: MonthlyData;
  lightlyActiveMinutes: MonthlyData;
  minutesAsleep: MonthlyData;
  minutesAwake: MonthlyData;
  moderatelyActiveMinutes: MonthlyData;
  sedentaryMinutes: MonthlyData;
  steps: MonthlyData;
  timeInBed: MonthlyData;
  veryActiveMinutes: MonthlyData;
}
interface ActivityDayData {
  calories: DayData;
  distance: DayData;
  lightlyActiveMinutes: DayData;
  minutesAsleep: DayData;
  minutesAwake: DayData;
  moderatelyActiveMinutes: DayData;
  sedentaryMinutes: DayData;
  steps: DayData;
  timeInBed: DayData;
  veryActiveMinutes: DayData;
}
interface ActivityWeekData {
  calories: WeekData;
  distance: WeekData;
  lightlyActiveMinutes: WeekData;
  minutesAsleep: WeekData;
  minutesAwake: WeekData;
  moderatelyActiveMinutes: WeekData;
  sedentaryMinutes: WeekData;
  steps: WeekData;
  timeInBed: WeekData;
  veryActiveMinutes: WeekData;
}
function transformActivityDataByMonth(originalData: Record<string, any>): ActivityData {
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

  const activityData: ActivityData = {
    calories: {} as MonthlyData,
    distance: {} as MonthlyData,
    lightlyActiveMinutes: {} as MonthlyData,
    minutesAsleep: {} as MonthlyData,
    minutesAwake: {} as MonthlyData,
    moderatelyActiveMinutes: {} as MonthlyData,
    sedentaryMinutes: {} as MonthlyData,
    steps: {} as MonthlyData,
    timeInBed: {} as MonthlyData,
    veryActiveMinutes: {} as MonthlyData,
  };

  monthNames.forEach((month) => {
    const data = originalData[month] || { calories: 0, distance: 0, steps: 0 }; // Fallback to 0 if no data

    // 检查数据类型并适当转换
    activityData.calories[month] =
      typeof data.calories === 'number'
        ? parseFloat(data.calories.toFixed(2))
        : parseFloat(data.calories) || 0;
    activityData.distance[month] =
      typeof data.distance === 'number'
        ? parseFloat(data.distance.toFixed(2))
        : parseFloat(data.distance) || 0;
    activityData.steps[month] =
      typeof data.steps === 'number' ? data.steps : parseInt(data.steps) || 0;
    activityData.sedentaryMinutes[month] =
      typeof data.sedentaryMinutes === 'number'
        ? data.sedentaryMinutes
        : parseInt(data.sedentaryMinutes) || 0;
    activityData.lightlyActiveMinutes[month] =
      typeof data.lightlyActiveMinutes === 'number'
        ? data.lightlyActiveMinutes
        : parseInt(data.lightlyActiveMinutes) || 0;
    activityData.moderatelyActiveMinutes[month] =
      typeof data.moderatelyActiveMinutes === 'number'
        ? data.moderatelyActiveMinutes
        : parseInt(data.moderatelyActiveMinutes) || 0;
    activityData.veryActiveMinutes[month] =
      typeof data.veryActiveMinutes === 'number'
        ? data.veryActiveMinutes
        : parseInt(data.veryActiveMinutes) || 0;
    activityData.minutesAsleep[month] =
      typeof data.minutesAsleep === 'number'
        ? data.minutesAsleep
        : parseInt(data.minutesAsleep) || 0;
    activityData.minutesAwake[month] =
      typeof data.minutesAwake === 'number' ? data.minutesAwake : parseInt(data.minutesAwake) || 0;
    activityData.timeInBed[month] =
      typeof data.timeInBed === 'number' ? data.timeInBed : parseInt(data.timeInBed) || 0;
  });

  return activityData;
}
function transformActivityDataByDay(originalData: Record<string, any>): ActivityDayData {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  const activityData: ActivityDayData = {
    calories: {} as DayData,
    distance: {} as DayData,
    lightlyActiveMinutes: {} as DayData,
    minutesAsleep: {} as DayData,
    minutesAwake: {} as DayData,
    moderatelyActiveMinutes: {} as DayData,
    sedentaryMinutes: {} as DayData,
    steps: {} as DayData,
    timeInBed: {} as DayData,
    veryActiveMinutes: {} as DayData,
  };

  dayNames.forEach((day) => {
    const data = originalData[day] || { calories: 0, distance: 0, steps: 0 }; // Fallback to 0 if no data

    // 检查数据类型并适当转换
    activityData.calories[day] =
      typeof data.calories === 'number'
        ? parseFloat(data.calories.toFixed(2))
        : parseFloat(data.calories) || 0;
    activityData.distance[day] =
      typeof data.distance === 'number'
        ? parseFloat(data.distance.toFixed(2))
        : parseFloat(data.distance) || 0;
    activityData.steps[day] =
      typeof data.steps === 'number' ? data.steps : parseInt(data.steps) || 0;
    activityData.sedentaryMinutes[day] =
      typeof data.sedentaryMinutes === 'number'
        ? data.sedentaryMinutes
        : parseInt(data.sedentaryMinutes) || 0;
    activityData.lightlyActiveMinutes[day] =
      typeof data.lightlyActiveMinutes === 'number'
        ? data.lightlyActiveMinutes
        : parseInt(data.lightlyActiveMinutes) || 0;
    activityData.moderatelyActiveMinutes[day] =
      typeof data.moderatelyActiveMinutes === 'number'
        ? data.moderatelyActiveMinutes
        : parseInt(data.moderatelyActiveMinutes) || 0;
    activityData.veryActiveMinutes[day] =
      typeof data.veryActiveMinutes === 'number'
        ? data.veryActiveMinutes
        : parseInt(data.veryActiveMinutes) || 0;
    activityData.minutesAsleep[day] =
      typeof data.minutesAsleep === 'number'
        ? data.minutesAsleep
        : parseInt(data.minutesAsleep) || 0;
    activityData.minutesAwake[day] =
      typeof data.minutesAwake === 'number' ? data.minutesAwake : parseInt(data.minutesAwake) || 0;
    activityData.timeInBed[day] =
      typeof data.timeInBed === 'number' ? data.timeInBed : parseInt(data.timeInBed) || 0;
  });

  return activityData;
}

function transformActivityDataByWeek(originalData: Record<string, any>): ActivityWeekData {
  const weekNames = ['Week1', 'Week2', 'Week3', 'Week4'];

  const activityData: ActivityWeekData = {
    calories: {} as WeekData,
    distance: {} as WeekData,
    lightlyActiveMinutes: {} as WeekData,
    minutesAsleep: {} as WeekData,
    minutesAwake: {} as WeekData,
    moderatelyActiveMinutes: {} as WeekData,
    sedentaryMinutes: {} as WeekData,
    steps: {} as WeekData,
    timeInBed: {} as WeekData,
    veryActiveMinutes: {} as WeekData,
  };

  weekNames.forEach((week) => {
    const data = originalData[week] || { calories: 0, distance: 0, steps: 0 }; // Fallback to 0 if no data

    // 检查数据类型并适当转换
    activityData.calories[week] =
      typeof data.calories === 'number'
        ? parseFloat(data.calories.toFixed(2))
        : parseFloat(data.calories) || 0;
    activityData.distance[week] =
      typeof data.distance === 'number'
        ? parseFloat(data.distance.toFixed(2))
        : parseFloat(data.distance) || 0;
    activityData.steps[week] =
      typeof data.steps === 'number' ? data.steps : parseInt(data.steps) || 0;
    activityData.sedentaryMinutes[week] =
      typeof data.sedentaryMinutes === 'number'
        ? data.sedentaryMinutes
        : parseInt(data.sedentaryMinutes) || 0;
    activityData.lightlyActiveMinutes[week] =
      typeof data.lightlyActiveMinutes === 'number'
        ? data.lightlyActiveMinutes
        : parseInt(data.lightlyActiveMinutes) || 0;
    activityData.moderatelyActiveMinutes[week] =
      typeof data.moderatelyActiveMinutes === 'number'
        ? data.moderatelyActiveMinutes
        : parseInt(data.moderatelyActiveMinutes) || 0;
    activityData.veryActiveMinutes[week] =
      typeof data.veryActiveMinutes === 'number'
        ? data.veryActiveMinutes
        : parseInt(data.veryActiveMinutes) || 0;
    activityData.minutesAsleep[week] =
      typeof data.minutesAsleep === 'number'
        ? data.minutesAsleep
        : parseInt(data.minutesAsleep) || 0;
    activityData.minutesAwake[week] =
      typeof data.minutesAwake === 'number' ? data.minutesAwake : parseInt(data.minutesAwake) || 0;
    activityData.timeInBed[week] =
      typeof data.timeInBed === 'number' ? data.timeInBed : parseInt(data.timeInBed) || 0;
  });

  return activityData;
}
// Define the GET method to fetch activity data
// export async function GET(request: NextRequest) {
//   console.log('UserId', request.nextUrl.searchParams.get('userId'));
//   const userId = request.nextUrl.searchParams.get('userId');
//   console.log('activity route.ts is called');
//   // 函数转换原始数据到新格式

//   try {
//     const activityDbData = await ActivityService.queryDailiyActivity(userId || '');
//     const formattedData = transformActivityDataByMonth(activityDbData);
//     console.log('Activity Data in api/route:', formattedData);
//     return NextResponse.json(formattedData);
//   } catch (error) {
//     console.error('Failed to fetch activity data:', error);
//   }
// }
export async function GET(request: NextRequest) {
  console.log('UserId', request.nextUrl.searchParams.get('userId'));
  const userId = request.nextUrl.searchParams.get('userId');
  const year = request.nextUrl.searchParams.get('year');
  const month = request.nextUrl.searchParams.get('month');
  const week = request.nextUrl.searchParams.get('week');
  console.log('activity route.ts is called');

  try {
    let activityDbData;
    let formattedData;

    // 优先判断 week
    if (week) {
      activityDbData = await ActivityService.queryDailiyActivityByWeek(userId || '', week);
      formattedData = transformActivityDataByDay(activityDbData);
    }
    // 如果 week 为空，判断 month
    else if (month) {
      activityDbData = await ActivityService.queryDailiyActivityByMonth(userId || '', month);
      formattedData = transformActivityDataByWeek(activityDbData);
    }
    // 如果 month 为空，判断 year
    else if (year) {
      activityDbData = await ActivityService.queryDailiyActivityByYear(userId || '', year);
      formattedData = transformActivityDataByMonth(activityDbData);
    }
    // 如果都为空，调用默认的 queryDailiyActivity
    else {
      activityDbData = await ActivityService.queryDailiyActivity(userId || '');
      formattedData = transformActivityDataByMonth(activityDbData);
    }

    console.log('Activity Data in api/route:', formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch activity data' }, { status: 500 });
  }
}
