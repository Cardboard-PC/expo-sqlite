import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  container: {
    flexShrink: 1, // flexGrow, flex
    // flexBasis: 'auto', // Allow the container to take up only the space it needs
    marginVertical: 8,
    marginHorizontal: 8,
    //
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    //
    paddingHorizontal: 8,
    paddingVertical: auto,
    backgroundColor: '#ffccff',
  },
  containerBlue: {
    flexShrink: 1, // Allow the container to shrink if needed
    flexBasis: 'auto', // Allow the container to take up only the space it needs
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginVertical: 8,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    backgroundColor: '#ccccff',
  },
  timeText: {
    // Your styles here
  },
  smallTimeText: {
    // Your styles here
  },
  // Add other styles here
});

export default styles;