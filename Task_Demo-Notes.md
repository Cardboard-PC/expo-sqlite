



`Task_Demo` <-- 4x `Task`
`Task` <-- `CountDown`

## `CountDown`
```ts
label:   string;
dueDate: Date;
displayNumHoursAhead?:     number; // 0-48, typically 8-16, default 24
displayNumHoursOfNextDay?: number; // 0-24, typically 8-12, default 10
```

CountDown will show
00:00:00 (hours:minutes:seconds) until the dueDate.
OR
00d (days) until the dueDate.

Why am I using a `type` for `TimeUntilDue` in `CountDown`?
Should I instead use an `interface`?

put more logic in it
If I want hours display in hours
If I want days display in days
allow these as defaults
`displayInDaysIfWithinXDays: number; // 0-7, typically 1-3, default 2`
`displayInHoursIfWithinXHours: number; // 0-48, typically 8-16, default 24`
`
// leave this out for now --> `displayInCustomMinutesAmountsIfWithinXMinutes: number; // 0-60, typically 15-30, default 30`
// leave this out for now --> `customMinutesAmount: 20`

### ES7+ React/Redux/React-Native snippets
https://github.com/r5n-dev/vscode-react-javascript-snippets/blob/HEAD/docs/Snippets.md

