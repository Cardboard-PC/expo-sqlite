import React, { useState, useEffect, ReactElement } from 'react';
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
  // const [timeUntilDue, settimeUntilDue] = useState<string>('');
  const [daysStr, setDaysStr] = useState<string>('');
  const [hoursStr, setHoursStr] = useState<string>('');
  const [minutesStr, setMinutesStr] = useState<string>('');
  const [secondsStr, setSecondsStr] = useState<string>('');
  const [overdueBool, setOverdueBool] = useState<boolean>(false);
  // const [time]


  // const maxHoursAllowed = 24;
  // [ ] TODO -- Allow visibility into next day for awareness of time left to sleep
  // [ ] TODO -- Allow visibility of task durations in other forms
  //             [ ] -- More than 60 minutes
  //             [ ] -- Other units of measurements, such as pomodoro time periods
  //                    -- e.g. with 25 minutes of work and 5 minutes of rest per cycle a 55 minute task would be 2.1 cycles + 2 breaks. should these be spaced evenly or should the breaks be at the end?

  // // Note: variables needed for rendering
  // let daysStr:    string = "";
  // let hoursStr:   string = "";
  // let minutesStr: string = "";
  // let secondsStr: string = "";


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
      // return (
      //     <View style={styles.container}>
      //       <Text>{label}</Text>
      //       <Text style={styles.timeText}>Current Time: {currentTime.toLocaleTimeString()}</Text>
      //       <Text style={styles.timeText}>
      //         <Text style={styles.smallTimeText}>Time Until Due: </Text>
      //         {timeUntilDue}
      //       </Text>
      //   </View>
      // );
      //
      // NEW VERSION
      // days
      const daysNum: number   = Math.floor(timeDifference  / (1000 * 60 * 60 * 24))
      // let   daysStr: string;
      if (daysNum !== 0) {
        setDaysStr(String(daysNum))
        // daysStr = String(daysNum).padStart(2, '0') + "d"; // `.padStart()` Converts `9` into `"09"`, etc.
        // if (timeDifference > 0) {
        //   settimeUntilDue(daysStr + "d");
        // } else {
        //   settimeUntilDue('+' + daysStr + "d");
        // }
      }
      // else { // IF (daysNum == 0)
        // hours
        // const hoursNum:   number = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // limits visibility of next day
        const hoursNum:   number = Math.floor((timeDifference                        ) / (1000 * 60 * 60));
        const minutesNum: number = Math.floor((timeDifference % (1000 * 60 * 60     )) / (1000 * 60     ));
        const secondsNum: number = Math.floor((timeDifference % (1000 * 60          )) / (1000          ));
        if (hoursNum == 0) {
          setHoursStr("");
        } else {
          setHoursStr(String(hoursNum).padStart(2, '0')); // `.padStart()` Converts `9` into `"09"`, etc.
        }
        if (hoursNum == 0 && minutesNum == 0) {
          setMinutesStr("");
        } else {
          setMinutesStr(String(hoursNum).padStart(2, '0')); // `.padStart()` Converts `9` into `"09"`, etc.
        }
        if (hoursNum == 0 && minutesNum == 0 && secondsNum === 0) {
          setSecondsStr("");
        } else {
          setSecondsStr(String(secondsNum).padStart(2, '0')); // `.padStart()` Converts `9` into `"09"`, etc.
        }
        //
        // IF overdue
        if (timeDifference > 0) {
          setOverdueBool(false);
          // settimeUntilDue(hoursStr + minutesStr + secondsStr);
        } else {
          setOverdueBool(true);
          // settimeUntilDue('+' + hoursStr + minutesStr + secondsStr);
        }
        // settimeUntilDue(`+${hoursStr}h ${minutesStr}m ${secondsStr}s`);
      // }
    }, 1000); // update every 1000ms

    return () => clearInterval(interval);
  }, []);

  let resultRE: ReactElement;
  let overdueStr = "";
  if (overdueBool) { overdueStr = "+"; }
  // if overdueBool {}
  //
  // if (daysStr !== "") {
  if (daysStr !== "" && overdueStr == "22") {
    resultRE = (
      <View style={styles.container}>
        <Text style={styles.timeText}>{daysStr}d</Text>
      </View>
    )
  } else {
    // console.log("dayStr: " + daysStr);
    // if (daysStr == "") {console.log("dayStr is \"\"\t1 end");}
    // if (daysStr === "") {console.log("dayStr is \"\"\t2 end");}
    // console.log("hoursStr: " + hoursStr + "\tend");
    // console.log("minutesStr: " + minutesStr + "\tend");
    resultRE = (
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {/* <Text style={styles.smallTimeText}>Time Until Due: </Text> */}
          <Text style={styles.smallTimeText}>{label}: </Text>
          {currentTime.toLocaleTimeString()}___  {/* for testing */}
          {/* {'\u2236'} : Unicode Ratio Character */}
          {hoursStr}{'\u2236'}{minutesStr}{'\u2236'}{secondsStr}
        </Text>
      </View>
    )
  }
  //
  return ( resultRE );
};

// I still don't understand why I would use state for anything... I'll try adding things without state first

// interface InnerNumbersProps extends PropsWithChildren {
//   daysStr: string;
//   hoursStr: string;
//   minutesStr: string;
//   secondsStr: string;
// };

// function InnerNumbers({daysStr, hoursStr, minutesStr, secondsStr, }: InnerNumbersProps) { // WORKS
//   // const [currentTime, setCurrentTime] = useState(new Date());
//   // const [timeUntilDue, settimeUntilDue] = useState('');

  


//   return ( resultRE );
//   //   if (daysStr !== "") {
//   //     <View style={styles.container}>
//   //       <Text>{daysStr}d</Text>
//   //     </View>
//   //   } else {

//   //   }
  
//   //   // <View style={{padding: 10, flex: 1, flexShrink: 1}}>
//   //     <View style={styles.container}>
//   //       <Text>{label}
//   //         if (daysStr !== "") {
//   //         }
//   //       </Text>
//   //       {/* <Text style={styles.timeText}>
//   //         <Text style={styles.smallTimeText}>Time Until Due: </Text>
//   //         {timeUntilDue}
//   //       </Text> */}
        
//   //   </View>
//   // );
// };


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
    fontFamily: 'monospace',
    // fontFamily: 'Roboto',
    fontSize: 20,
    // marginBottom: 10,
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