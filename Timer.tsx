import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntil6PM, setTimeUntil6PM] = useState('');

  // useEffect for an automatic update?
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const sixPM = new Date();
      sixPM.setHours(18, 0, 0, 0);

      const timeDifference = sixPM.getTime() - now.getTime();
      if (timeDifference > 0) {
        const hours   = Math.floor(timeDifference  / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setTimeUntil6PM(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeUntil6PM('00h 00m 00s');
      }
    }, 1000); // update every 1000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>Current Time: {currentTime.toLocaleTimeString()}</Text>
      <Text style={styles.timeText}>Time Until 6 PM: {timeUntil6PM}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: "flexShrink",
    // flex: "flexShrink",
    justifyContent: 'center', // the main "div" (sub-divs are still left aligned within main)
    // alignItems: 'center',  // all "sub-divs"
    backgroundColor: '#ff00ff',
  },
  timeText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default Timer;