// import { UserJSON } from '@clerk/backend';
import { NextResponse } from 'next/server';

import { ActivityModel } from '@/database/server/models/dailyActivity';
import { UserModel } from '@/database/server/models/user';
import { pino } from '@/libs/logger';

export class ActivityService {
  deleteUser = async (id?: string) => {
    if (id) {
      pino.info('delete user due to clerk webhook');

      await UserModel.deleteUser(id);

      return NextResponse.json({ message: 'user deleted' }, { status: 200 });
    } else {
      pino.warn('clerk sent a delete user request, but no user ID was included in the payload');
      return NextResponse.json({ message: 'ok' }, { status: 200 });
    }
  };

  static queryDailiyActivity = async (id: string) => {
    pino.info('Checking daily activity data based on user id');

    const acitvityModel = new ActivityModel();

    // Check if user already exists
    const res = await UserModel.findById(id);

    // If user not exists, skip update the user
    if (!res)
      return NextResponse.json(
        {
          message: 'User not signed up yet',
          success: false,
        },
        { status: 200 },
      );

    const result = await acitvityModel.getMonthlyActivitySummary(id);
    console.log('Activity Summary in service layer', result);
    return result;
  };
  static queryDailiyActivityByYear = async (id: string, year: string) => {
    pino.info('Checking daily activity data based on user id');

    const acitvityModel = new ActivityModel();

    // Check if user already exists
    const res = await UserModel.findById(id);

    // If user not exists, skip update the user
    if (!res)
      return NextResponse.json(
        {
          message: 'User not signed up yet',
          success: false,
        },
        { status: 200 },
      );

    const result = await acitvityModel.getMonthlyActivitySummaryByYear(id, year);
    console.log('Activity Summary in service layer', result);
    return result;
  };
  static queryDailiyActivityByWeek = async (id: string, week: string) => {
    pino.info('Checking daily activity data based on user id');

    const acitvityModel = new ActivityModel();

    // Check if user already exists
    const res = await UserModel.findById(id);

    // If user not exists, skip update the user
    if (!res)
      return NextResponse.json(
        {
          message: 'User not signed up yet',
          success: false,
        },
        { status: 200 },
      );

    const result = await acitvityModel.getWeeklyActivitySummaryByWeekString(id, week);
    console.log('Activity Summary in service layer', result);
    return result;
  };
  static queryDailiyActivityByMonth = async (id: string, month: string) => {
    pino.info('Checking daily activity data based on user id');

    const acitvityModel = new ActivityModel();

    // Check if user already exists
    const res = await UserModel.findById(id);

    // If user not exists, skip update the user
    if (!res)
      return NextResponse.json(
        {
          message: 'User not signed up yet',
          success: false,
        },
        { status: 200 },
      );

    const result = await acitvityModel.getMonthlyActivitySummaryByMonth(id, month);
    console.log('Activity Summary in service layer', result);
    return result;
  };
}
