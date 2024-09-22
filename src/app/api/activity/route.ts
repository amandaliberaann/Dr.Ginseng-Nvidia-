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
function transformActivityData(originalData: Record<string, any>): ActivityData {
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
// Define the GET method to fetch activity data
export async function GET(request: NextRequest) {
  console.log('UserId', request.nextUrl.searchParams.get('userId'));
  const userId = request.nextUrl.searchParams.get('userId');
  console.log('activity route.ts is called');
  // 函数转换原始数据到新格式

  try {
    // const activityData: ActivityData = {
    //   calories: {
    //     Apr: 530,
    //     Aug: 495,
    //     Dec: 500,
    //     Feb: 450,
    //     Jan: 500,
    //     Jul: 510,
    //     Jun: 450,
    //     Mar: 480,
    //     May: 470,
    //     Nov: 415,
    //     Oct: 420,
    //     Sep: 500,
    //   },
    //   distance: {
    //     Apr: 8,
    //     Aug: 7.4,
    //     Dec: 7.2,
    //     Feb: 6.9,
    //     Jan: 7.5,
    //     Jul: 7.8,
    //     Jun: 7,
    //     Mar: 7.2,
    //     May: 6.5,
    //     Nov: 5.9,
    //     Oct: 6.1,
    //     Sep: 7.6,
    //   },
    //   steps: {
    //     Apr: 1400,
    //     Aug: 1200,
    //     Dec: 1200,
    //     Feb: 1100,
    //     Jan: 1200,
    //     Jul: 1250,
    //     Jun: 1100,
    //     Mar: 1300,
    //     May: 1150,
    //     Nov: 9500,
    //     Oct: 1000,
    //     Sep: 1300,
    //   },
    // };
    const activityDbData = await ActivityService.queryDailiyActivity(userId || '');
    const formattedData = transformActivityData(activityDbData);
    console.log('Activity Data in api/route:', formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
  }
}
