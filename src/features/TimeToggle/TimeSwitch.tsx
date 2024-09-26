import { DatePicker, Space } from 'antd';
import type { DatePickerProps } from 'antd';
import React from 'react';

type SelectedDates = {
  month: string | null;
  week: string | null;
  year: string | null;
};
interface TimeSwitchProps {
  onDateChange: (type: keyof SelectedDates, date: any, dateString: string | string[]) => void;
}

const TimeSwitch: React.FC<TimeSwitchProps> = ({ onDateChange }) => {
  const handleWeekChange: DatePickerProps['onChange'] = (date, dateString) => {
    onDateChange('week', date, dateString); // 调用回调并传递类型
  };

  const handleMonthChange: DatePickerProps['onChange'] = (date, dateString) => {
    onDateChange('month', date, dateString); // 调用回调并传递类型
  };

  const handleYearChange: DatePickerProps['onChange'] = (date, dateString) => {
    onDateChange('year', date, dateString); // 调用回调并传递类型
  };

  return (
    <Space direction="horizontal">
      <DatePicker onChange={handleWeekChange} picker="week" />
      <DatePicker onChange={handleMonthChange} picker="month" />
      <DatePicker onChange={handleYearChange} picker="year" />
    </Space>
  );
};

export default TimeSwitch;
