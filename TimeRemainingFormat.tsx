/*
TimeRemainingFormat is a file that is meant to contain an object, which allows custom time formats to be used depending on how much times is remaning
For example:
From 0-90 minutes, display the time in minutes (not hours and minutes)
From 90 minutes to 24 hours, display the time in hours (with 1 decimal place)
From 24 hours to 7 days, display the time in days (with 1 decimal place)
From 7 days to 30 days, display the time in weeks
From 30 days to infinity, display the time in months

However the time formats are meant to be changeable, they each have a `maximum` range in which they will effect, their minimum range is decided by the format before them. Each is stored within an array/list.

Could you please help me generate the code for this object/component?
*/

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export interface TimeFormat {
  max:    number;
  format: (minutes: number) => JSX.Element;
}

// TIME FORMATS
export const timeFormats1: TimeFormat[] = [
  /* minimum times are implicit, and the last value is used in the case of infinity
  ** max: is the maximum time in minutes that this format will effect
  ** format: is a function that will return the time in the desired format (as a string)
  ** - These use lambda funtions with implicit/direct return statements. They look strange but are simple. */
  {
    max:    0,       // DISPLAY nothing UNTIL 0 minutes
    format: () => <Text></Text>
  },
  {
    max:    90,      // DISPLAY IN minutes (without "m" extension) UNTIL 90 minutes
    format: (minutes: number) => <Text>{Math.floor(minutes)}</Text>
  },
  {
    max:    60*24,   // DISPLAY IN hours (with "h" extension) UNTIL 24 hours
    format: (minutes: number) => <Text>{Math.floor(minutes/60)}<Text style={styles.smallText}>h</Text></Text>
  },
  {
    max:    60*24*7, // DISPLAY IN days (with "d" extension) UNTIL 7 days
    // format: (minutes: number) => `"${Math.floor(minutes/(60*24))}d"`
    format: (minutes: number) => <Text>{Math.floor(minutes/(60*24))}<Text style={styles.smallText}>d</Text></Text>
  },
  // The last format is a placeholder for later
  {
    max:    1234,   // DISPLAY IN 15-minute-lengths (with 1dp) UNTIL ???
    format: (minutes: number) => <Text>{(minutes/15).toFixed(1)}<Text style={styles.smallText}>x</Text></Text>
  }
  // {'\u2236'} : Unicode Ratio Character
];

// TIME FORMATS
export const timeFormats2: TimeFormat[] = [
  /* minimum times are implicit, and the last value is used in the case of infinity
  ** max: is the maximum time in minutes that this format will effect
  ** format: is a function that will return the time in the desired format (as a string)
  ** - These use lambda funtions with implicit/direct return statements. They look strange but are simple. */
  {
    max:    0,       // DISPLAY nothing UNTIL 0 minutes
    format: () => <Text></Text>
  },
  {
    max:    90,      // DISPLAY IN minutes (without "m" extension) UNTIL 90 minutes
    format: (minutes: number) => <Text>{Math.floor(minutes)}</Text>
  },
  {
    max:    60*24,   // DISPLAY IN hours (with "h" extension) UNTIL 24 hours
    format: (minutes: number) => <Text>{Math.floor(minutes/60)}<Text style={styles.smallText}>h</Text></Text>
  },
  {
    max:    60*24*7, // DISPLAY IN days (with "d" extension) UNTIL 7 days
    // format: (minutes: number) => `"${Math.floor(minutes/(60*24))}d"`
    format: (minutes: number) => <Text>{Math.floor(minutes/(60*24))}<Text style={styles.smallText}>d</Text></Text>
  },
  // The last format is a placeholder for later
  {
    max:    1234,   // DISPLAY IN 15-minute-lengths (with 1dp) UNTIL ???
    format: (minutes: number) => <Text>{(minutes/15).toFixed(1)}<Text style={styles.smallText}>x</Text></Text>
  }
  // {'\u2236'} : Unicode Ratio Character
];

// formatTimeRemaining = (minutes: number) => {
// }


interface TimeRemainingFormatProps {
  minutes: number;
  timeFormats: TimeFormat[];
}

// export default TimeRemainingFormat;

const styles = StyleSheet.create({
  smallText: {
    fontSize: 8,
  }
});
