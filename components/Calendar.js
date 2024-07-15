import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Text } from '@ui-kitten/components';
import { loginContext } from '../context/context';

const LeftArrow = ({ onPress }) => (
  <TouchableOpacity style={styles.arrow} onPress={onPress}>
    <Text>PREV</Text>
  </TouchableOpacity>
);

const RightArrow = ({ onPress }) => (
  <TouchableOpacity style={styles.arrow} onPress={onPress}>
    <Text>NEXT</Text>
  </TouchableOpacity>
);

export const CalendarCustomDayShowcase = () => {
 const {date,setDate} = useContext(loginContext)
  return (
    <Calendar
      date={date}
      onSelect={nextDate => setDate(nextDate)}
      renderArrowLeft={LeftArrow}
      renderArrowRight={RightArrow}
       style={{width: "100%", height: "80%"}}
    />
  );
};

const styles = StyleSheet.create({
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
