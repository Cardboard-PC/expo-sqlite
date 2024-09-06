import React, { useState, useEffect, ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';

// interface CountDownProps extends PropsWithChildren {
class CountDownProps {
  label:   string;
  dueDate: Date;
  displayNumHoursAhead?:     number; // 0-48, typically 8 to 16 if set, defaults to 24
  displayNumHoursOfNextDay?: number; // 0-24, typically 8 to 12 if set, defaults to 10

  constructor(
    label
  ) {
    this.label = "";
    dueDate: Date;
    displayNumHoursAhead?:     number; // 0-48, typically 8 to 16 if set, defaults to 24
    displayNumHoursOfNextDay?: number; // 0-24, typically 8 to 12 if set, defaults to 10
  }
};

type TimeUntilDue = {
  currentTime:   Date;
  overdueBool:   boolean;
  overdueStr:    string;
  daysStr:       string;
  totalHoursStr: string;
  minutesStr:    string;
  secondsStr:    string;
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

// function hoursUntilTask(now: Date, dueDate: Date, ): number {
// }

// function CountDown(props: CountDownProps) { // WORKS but requires `props.propertyName` to access properties
// function CountDown({label, dueTime}: React.FC<CountDownProps>) { // WORKS
// function CountDown({label, dueTime}: CountDownProps) { // WORKS
const CountDown = ({
  label = "",
  dueDate: dueDate,
  displayNumHoursAhead = 24,
  displayNumHoursOfNextDay = 10,
}: CountDownProps) => {
  const [tud, setTud] = useState<TimeUntilDue>({
    currentTime:   new Date(),
    overdueBool:   false,
    overdueStr:    "",
    daysStr:       "",
    totalHoursStr: "",
    minutesStr:    "",
    secondsStr:    "",
  });


  // const maxHoursAllowed = 24;
  // [ ] TODO -- Allow visibility into next day for awareness of time left to sleep
  // [ ] TODO -- Allow visibility of task durations in other forms
  //             [ ] -- More than 60 minutes
  //             [ ] -- Other units of measurements, such as pomodoro time periods
  //                    -- e.g. with 25 minutes of work and 5 minutes of rest per cycle a 55 minute task would be 2.1 cycles + 2 breaks. should these be spaced evenly or should the breaks be at the end?

  // useEffect for an automatic update?
  useEffect(() => {
    const updateTud = () => {
      const newTud: TimeUntilDue = {
        currentTime:   new Date(),
        overdueBool:   false,
        overdueStr:    "",
        daysStr:       "",
        totalHoursStr: "",
        minutesStr:    "",
        secondsStr:    "",
      };

      const now = new Date();
      // setCurrentTime(now);

      const timeDifference = dueDate.getTime() - now.getTime();
      // days
      const daysNum:    number = Math.floor( timeDifference                          / (1000 * 60 * 60 * 24));
      const hoursNum:   number = Math.floor((timeDifference                        ) / (1000 * 60 * 60     ));
      const minutesNum: number = Math.floor((timeDifference % (1000 * 60 * 60     )) / (1000 * 60          ));
      const secondsNum: number = Math.floor((timeDifference % (1000 * 60          )) / (1000               ));
      if (daysNum !== 0) {
        newTud.daysStr = String(daysNum);
      }
      if (hoursNum !== 0) {
        newTud.totalHoursStr   = String(hoursNum  ).padStart(2, '0'); // `.padStart()` Converts `9` into `"09"`, etc.
      }
      if (hoursNum !== 0 && minutesNum !== 0) {
        newTud.minutesStr = String(hoursNum  ).padStart(2, '0'); // `.padStart()` Converts `9` into `"09"`, etc.
      }
      if (hoursNum !== 0 && minutesNum !== 0 && secondsNum !== 0) {
        newTud.secondsStr = String(secondsNum).padStart(2, '0'); // `.padStart()` Converts `9` into `"09"`, etc.
      }
      // IF overdue
      if (timeDifference < 0) { newTud.overdueBool = true; newTud.overdueStr = "+"; }

      setTud({...newTud});
    }

    const interval = setInterval(() => { updateTud();}, 1000); // update every 1000ms
    return () => clearInterval(interval);
  }, []);



  // --- REACT ELEMENT ---
  let resultRE: ReactElement;
  // let overdueStr = "";
  // if (overdueBool) { overdueStr = "+"; }
  // if overdueBool {}
  //
  // if (daysStr !== "") {
  if (tud.daysStr !== "") {
    // console.log("daysStr: " + tud.daysStr);
    // display hours until next task if allowed to show for next day
    // const hoursPastToday = dueTime.getHours() - 
    const now = new Date();
    const hourUntilEndOfDay = 24 - now.getHours();
    if (Number(tud.totalHoursStr) - hourUntilEndOfDay <= displayNumHoursOfNextDay) {
    resultRE = (
      <View style={styles.container}>
        <Text style={styles.timeText}>{tud.daysStr}d</Text>
      </View>);
    } else {
      // IF is task is far in the future, display it in days
      resultRE = (
      <View style={styles.container}>
        <Text style={styles.timeText}>{tud.daysStr}d</Text>
      </View>);
    }
  } else {
    // console.log("dayStr:s " + daysStr);
    // if (daysStr == "") {console.log("dayStr is \"\"\t1 end");}
    // if (daysStr === "") {console.log("dayStr is \"\"\t2 end");}
    // console.log("hoursStr: " + hoursStr + "\tend");
    // console.log("minutesStr: " + minutesStr + "\tend");
    resultRE = (
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {/* <Text style={styles.smallTimeText}>Time Until Due: </Text> */}
          <Text style={styles.smallTimeText}>{label}: </Text>
          {/* for testing */}
          {/* {tud.currentTime.toLocaleTimeString()}___ */}
          {/* {'\u2236'} : Unicode Ratio Character */}
          {tud.totalHoursStr}{'\u2236'}{tud.minutesStr}{'\u2236'}{tud.secondsStr}
        </Text>
      </View>
    )
  }

  // --- RETURN DISPLAY OF REACT ELEMENT ---
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