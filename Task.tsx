import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';
import type { TimeFormat } from './TimeRemainingFormat';
import { timeFormats1 } from './TimeRemainingFormat';
// import styles from './styles'; // Custom styles by me

import TimeRemaining, { TimeRemainingProps } from './TimeRemaining';

interface TaskProps {
  label:                    string;
  startDate:                Date;
  dueDate:                  Date;
  displayNumHoursOfNextDay: number;
}

const Task = ({
  label,
  // startDate = new Date(), // default = now
  startDate,
  dueDate,
  // displayNumHoursOfNextDay = 12, // default = 12
  displayNumHoursOfNextDay
}: TaskProps) => {
  const resultRE: ReactElement = (
    <View style={styles.containerBlue}>

      {/* LABEL */}
      <View style={styles.container}>
        {/* DEBUG */}
        <Text>Unused variable {displayNumHoursOfNextDay}</Text>

        <Text style={styles.timeText}>
          {/* LABEL */} {/* <Text style={styles.smallTimeText}>label: </Text> */} {label}
          {/* DEBUG TEST - [ ] MOVE THIS */} {/* {33}{'\u2236'}{33}{'\u2236'}{33} */} {/* {'\u2236'} : Unicode Ratio Character */}
        </Text>
      </View>

      {/* TIME UNTIL START */}
      <TimeRemaining
        dueDate={startDate}
        timeFormats={timeFormats1}>
      </TimeRemaining>

      {/* TIME UNTIL END */}
      <View style={styles.container}>
        <TimeRemaining
          dueDate={dueDate}
          timeFormats={timeFormats1}>
        </TimeRemaining>
      </View>

    </View>
  );
  return ( resultRE );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1, // flexGrow, flex
    marginVertical:   8,
    marginHorizontal: 8,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    //
    paddingHorizontal: 8,
    backgroundColor: '#ffccff',
  },
  containerBlue: {
    flexShrink: 1, // Allow the container to shrink if needed
    flexBasis: 'auto', // Allow the container to take up only the space it needs
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginVertical:   8,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    backgroundColor: '#ccccff',
  },
  timeText: {
    // TODO - make the colons between hours, minutes, and seconds float in the center of letters
    fontFamily: 'monospace',
    fontSize: 20,
  },
  smallTimeText: {
    fontSize: 8,
    marginBottom: 10,
  },
});

export default Task;