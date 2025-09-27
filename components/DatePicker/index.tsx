import { logGenerate } from '@/utils/logGenerate';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.3;

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

interface IDatePicker {
  selectedMonthIndex?: number;
  selectedDay?: number;
  onDateChange: (date: Date) => void;
  selectDay?: boolean
  selectMonth?: boolean
}

export default function DatePicker(props: IDatePicker) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedYearIndex, setSelectedYearIndex] = useState(10); // índice central do array de anos

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthRef = useRef<FlatList>(null);
  const dayRef = useRef<FlatList>(null);
  const yearRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollToIndex(selectedMonthIndex, 'month');
    scrollToIndex(selectedDay - 1, 'day');
    scrollToIndex(selectedYearIndex, 'year');

    const actualSelectedDate = new Date(
      years[selectedYearIndex],
      selectedMonthIndex,
      selectedDay
    );
    actualSelectedDate.setHours(0, 0, 0, 0);

    setSelectedDate(actualSelectedDate);
    props.onDateChange(actualSelectedDate);

    logGenerate('DatePicker --->> useEffect()', [`${actualSelectedDate.toISOString()}`]);
  }, []);

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    type: 'month' | 'day' | 'year'
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    const newDate = new Date(selectedDate);
    newDate.setHours(0, 0, 0, 0);

    if (type === 'month') {
      setSelectedMonthIndex(index);
      newDate.setMonth(index);
    } else if (type === 'day') {
      setSelectedDay(days[index]);
      newDate.setDate(days[index]);
    } else if (type === 'year') {
      setSelectedYearIndex(index);
      newDate.setFullYear(years[index]);
    }

    setSelectedDate(newDate);
    props.onDateChange(newDate);
    logGenerate('DatePicker --->> onMomentumScrollEnd', [`${newDate}`]);
  };

  const scrollToIndex = (index: number, type: 'month' | 'day' | 'year') => {
    if (type === 'month') {
      monthRef.current?.scrollToIndex({ index, animated: true });
      setSelectedMonthIndex(index);
    } else if (type === 'day') {
      dayRef.current?.scrollToIndex({ index, animated: true });
      setSelectedDay(days[index]);
    } else if (type === 'year') {
      yearRef.current?.scrollToIndex({ index, animated: true });
      setSelectedYearIndex(index);
    }
  };

  if (props.selectMonth === false && props.selectDay === false) {
    return (
      <View className='h-[50px]'>
        {/* Anos */}
        <FlatList
          ref={yearRef}
          data={years}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'year')}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index + 15,
            index,
          })}
          contentContainerStyle={styles.centeredList}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {
            const isSelected = selectedYearIndex === index;
            return (
              <TouchableOpacity onPress={() => scrollToIndex(index, 'year')}>
                <View style={styles.itemContainer}>
                  <Text style={[styles.month, isSelected && styles.textSelected]}>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    )
  }

  if (props.selectDay === false) {
    return (
      <View className='h-[80px]'>
        {/* Anos */}
        <FlatList
          ref={yearRef}
          data={years}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'year')}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index + 15,
            index,
          })}
          contentContainerStyle={styles.centeredList}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => {
            const isSelected = selectedYearIndex === index;
            return (
              <TouchableOpacity onPress={() => scrollToIndex(index, 'year')}>
                <View style={styles.itemContainer}>
                  <Text style={[styles.month, isSelected && styles.textSelected]}>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Meses */}
        <FlatList
          ref={monthRef}
          data={months}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'month')}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index + 15,
            index,
          })}
          contentContainerStyle={styles.centeredList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isSelected = selectedMonthIndex === index;
            return (
              <TouchableOpacity onPress={() => scrollToIndex(index, 'month')}>
                <View style={styles.itemContainer}>
                  <Text style={[styles.month, isSelected && styles.textSelected]}>
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    )
  }

  return (
    <View className='h-[140px]'>
      {/* Anos */}
      <FlatList
        ref={yearRef}
        data={years}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'year')}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index + 15,
          index,
        })}
        contentContainerStyle={styles.centeredList}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => {
          const isSelected = selectedYearIndex === index;
          return (
            <TouchableOpacity onPress={() => scrollToIndex(index, 'year')}>
              <View style={styles.itemContainer}>
                <Text style={[styles.month, isSelected && styles.textSelected]}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Meses */}
      <FlatList
        ref={monthRef}
        data={months}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'month')}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index + 15,
          index,
        })}
        contentContainerStyle={styles.centeredList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isSelected = selectedMonthIndex === index;
          return (
            <TouchableOpacity onPress={() => scrollToIndex(index, 'month')}>
              <View style={styles.itemContainer}>
                <Text style={[styles.month, isSelected && styles.textSelected]}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />


      {/* Dias */}

      <FlatList
        ref={dayRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => onMomentumScrollEnd(e, 'day')}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index + 15,
          index,
        })}
        contentContainerStyle={styles.centeredList}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => {
          const isSelected = selectedDay === item;
          return (
            <TouchableOpacity onPress={() => scrollToIndex(index, 'day')}>
              <View style={styles.itemContainer}>
                <Text style={[styles.day, isSelected && styles.textSelected]}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  centeredList: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    marginBottom: 0,
    height: 40,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  month: {
    color: '#555',
    fontFamily: 'OutfitRegular',
    fontSize: 18,
  },
  day: {
    color: '#555',
    fontSize: 18,
  },
  textSelected: {
    color: '#fafafa',
    width: 90,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#43403b',
    fontWeight: 'bold',
  },
});