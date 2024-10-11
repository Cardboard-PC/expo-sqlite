import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeRemainingProps {
  dueDate: Date;
}

const TimeRemaining = ({ dueDate }: TimeRemainingProps) => {
  const [minutesLeft, setMinutesLeft] = useState<number>(0);

  // UPDATE TIME-UNTIL-DUE (TUD) EVERY SECOND
  useEffect(() => {
    const updateMinutesLeft = () => {
      const now = new Date();
      const minutes = Math.floor((dueDate.getTime() - now.getTime()) / 1000 / 60);
      setMinutesLeft(minutes);
    };

    updateMinutesLeft(); // Initial call to set the state immediately
    const interval = setInterval(updateMinutesLeft, 1000); // update every 1000ms

    return () => clearInterval(interval);
  }, [dueDate]);

  // RENDER COMPONENT
  return (
    <View style={styles.container}>
      {/* DEBUG  */}
      <Text>TimeRemaining</Text>
      <TimeRemainingFormat minutes={minutesLeft} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    flexBasis: 'auto',
    marginVertical: 8,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    backgroundColor: '#ffccff',
  },
  // other styles...
});

export default TimeRemaining;