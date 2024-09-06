import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { TimeFormat } from './TimeRemainingFormat';

interface TimeRemainingProps {
  // label:   string;
  dueDate: Date;
  timeFormats: TimeFormats;
  // displayNumHoursAhead?:     number; // 0-48, typically 8 to 16 if set, defaults to 24
  // displayNumHoursOfNextDay?: number; // 0-24, typically 8 to 12 if set, defaults to 10
}

function hoursUntilTomorrow(now: Date): number {
  return 24 - (now.getHours());
}

function taskIsPastToday(now: Date, dueDate: Date): boolean {
  if ((dueDate.getTime() - now.getTime()) / ( 1000 * 60 * 60 * 24) >= 1) { return true; }
  else { return false; }
}

function taskIsOverdue(now: Date, dueDate: Date): boolean {
  if (((dueDate.getTime() - now.getTime())) >= 0) { return false; }
  else { return true; }
}

const TimeRemaining = ({
  dueDate,
  timeFormats,
}: TimeRemainingProps) => {
  const [minutesLeft, setMinutesLeft] = useState<number>(0);

  useEffect(() => {
    const updateMinutesLeft = () => {
      const now = new Date();
      setMinutesLeft(Math.floor((dueDate.getTime() - now.getTime()) / 1000 / 60));
    };

    updateMinutesLeft(); // Initial call to set the state immediately
    const interval = setInterval(updateMinutesLeft, 1000); // update every 1000ms
    return () => clearInterval(interval);
  }, []);

  // RENDER COMPONENT
  for (let i = 0; i < timeFormats.length; i++) {
    if (minutesLeft < timeFormats[i].max) {
      return timeFormats[i].format(minutesLeft);
    }
  }
  // ELSE
  return timeFormats[timeFormats.length-1].format(minutesLeft);
};

export default TimeRemaining;