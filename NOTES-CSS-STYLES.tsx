const styles = StyleSheet.create({
  container: {
    // flex: 1,        // Automatically expands container to fill 1 "unit" of available space
    flexShrink: 1,     // Allow the container to shrink if needed
    // flexGrow: 0,    // Prevent the container from growing to fill space
    flexBasis: 'auto', // Allow the container to take up only the space it needs

    // flexDirection: 'row',
    // flexWrap: 'wrap',

    // margin:  10,    // spacing without background color
    // padding: 10,    // spacing with    background color
    paddingHorizontal: 8,
    marginVertical:   8,
    marginHorizontal: 8,

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
  /* box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  }, */
});