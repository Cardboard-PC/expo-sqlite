import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';

interface CountDownProps extends PropsWithChildren {
  label:   string;
  dueTime: Date;
};

// function CountDown(props: CountDownProps) { // WORKS but requires `props.propertyName` to access properties
// function CountDown({label, dueTime}: React.FC<CountDownProps>) { // WORKS
function CountDown({label, dueTime}: CountDownProps) { // WORKS
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilDue, settimeUntilDue] = useState('');

  // useEffect for an automatic update?
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const timeDifference = dueTime.getTime() - now.getTime();
      // OLD VERSION
      // const hours   = Math.floor(timeDifference  / (1000 * 60 * 60))
      // const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      // const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      // if (timeDifference > 0) {
      //   settimeUntilDue(`${hours}h ${minutes}m ${seconds}s`);
      // } else {
      //   settimeUntilDue(`+${hours}h ${minutes}m ${seconds}s`);
      // }
      //
      // NEW VERSION
      // days
      const daysNum: number   = Math.floor(timeDifference  / (1000 * 60 * 60 * 24))
      let   daysStr: string;
      if (daysNum !== 0) {
        daysStr = String(daysNum).padStart(2, '0') + "d"; // `.padStart()` Converts `9` into `"09"`, etc.
        if (timeDifference > 0) {
          settimeUntilDue(daysStr + "d");
        } else {
          settimeUntilDue('+' + daysStr + "d");
        }
      } else {
        daysStr = "";
        // hours
        const hoursNum: number   = Math.floor((timeDifference  % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let   hoursStr: string;
        if (hoursNum !== 0) {
          hoursStr = String(hoursNum).padStart(2, '0'); // `.padStart()` Converts `9` into `"09"`, etc.
        } else {
          hoursStr = "";
        }
        //
        const minutesNum: number = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
        let   minutesStr: string;
        if (hoursNum !== 0 && minutesNum !== 0) {
          minutesStr = String(hoursNum).padStart(2, '0') + ":"; // `.padStart()` Converts `9` into `"09"`, etc.
        } else {
          minutesStr = "";
        }
        //
        const secondsNum: number = Math.floor((timeDifference % (1000 * 60)) / 1000);
        let   secondsStr: string;
        if (hoursNum !== 0 && minutesNum !== 0 && secondsNum !== 0) {
          secondsStr = String(secondsNum).padStart(2, '0'); // `.padStart()` Converts `9` into `"09"`, etc.
        } else {
          secondsStr = "";
        }
        if (timeDifference > 0) {
          settimeUntilDue(hoursStr + minutesStr + secondsStr);
        } else {
          settimeUntilDue('+' + hoursStr + minutesStr + secondsStr);
        }
      }
    }, 1000); // update every 1000ms

    return () => clearInterval(interval);
  }, []);


  return (
    // <View style={{padding: 10, flex: 1, flexShrink: 1}}>
      <View style={styles.container}>
        <Text>{label}</Text>
        {/* <Text style={styles.timeText}>Current Time: {currentTime.toLocaleTimeString()}</Text> */}
        <Text style={styles.timeText}>
          <Text style={styles.smallTimeText}>Time Until Due: </Text>
          {timeUntilDue}
        </Text>
      {/* </View> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    // flex: 1,    // Automatically expands container to fill 1 "unit" of available space
    flexShrink: 1, // Allow the container to shrink if needed
    // flexGrow: 0, // Prevent the container from growing to fill space
    flexBasis: 'auto', // Allow the container to take up only the space it needs
    // margin:  10, // spacing without background color
    // padding: 10, // spacing with    background color
    marginVertical:   8,
    marginHorizontal: 8,
    //
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    //
    paddingHorizontal: 8,
    backgroundColor: '#ffccff',
  },
  timeText: {
    // TODO - make the colons between hours, minutes, and seconds float in the center of letters
    // font: 'Roboto',
    // fontFamily: 'monospace',
    // fontFamily: 'Roboto',
    fontSize: 20,
    marginBottom: 10,
    // fontWeight: 'bold',
    // fontWeight: '300', // thin text
    // fontWeight: '600', // very bold text
    // fontWeight: '900', // very very bold text
  },
  smallTimeText: {
    fontSize: 8,
    marginBottom: 10,
  },
  // box: {
  //   width: 50,
  //   height: 50,
  // },
  // row: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },
  // button: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 6,
  //   borderRadius: 4,
  //   backgroundColor: 'oldlace',
  //   alignSelf: 'flex-start',
  //   marginHorizontal: '1%',
  //   marginBottom: 6,
  //   minWidth: '48%',
  //   textAlign: 'center',
  // },
  // selected: {
  //   backgroundColor: 'coral',
  //   borderWidth: 0,
  // },
  // buttonLabel: {
  //   fontSize: 12,
  //   fontWeight: '500',
  //   color: 'coral',
  // },
  // selectedLabel: {
  //   color: 'white',
  // },
  // label: {
  //   textAlign: 'center',
  //   marginBottom: 10,
  //   fontSize: 14,
  // },
});

export default CountDown;