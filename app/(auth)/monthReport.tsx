import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'


import BackButton from '@/components/BackButton'
import DatePicker from '@/components/DatePicker'

import { Customer, useCustomers } from '@/contexts/CustomersProvider'

import { router } from 'expo-router'


const ReportsPage = () => {

  const { customers } = useCustomers();

  const [dateSelected, setDateSelected] = useState(new Date());

  const [monthDebt, setMonthDebt] = useState("");
  const [averageDailyDebt, setAverageDailyDebt] = useState("");
  const [totalDebt, setTotalDebt] = useState("");

  const [barData, setBarData] = useState<{ value: number; label: string }[]>([]);


  const [showToolTipTotalMonth, setShowToolTipTotalMonth] = useState(false)
  const [showToolTipDailyMedia, setShowToolTipDailyMedia] = useState(false)


  useEffect(() => {
    if (customers) {
      const debts = customers.flatMap(customer => customer.debts || []);

      const filteredDebtsByMonth = debts.filter(debt => {
        const debtDate = new Date(debt.createdAt);
        return (
          debtDate.getMonth() === dateSelected.getMonth() &&
          debtDate.getFullYear() === dateSelected.getFullYear()
        );
      });

      const totalMonthDebt = filteredDebtsByMonth.reduce((acc, debt) => acc + debt.totalValue, 0);
      const totalMonthDebtFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalMonthDebt);
      setMonthDebt(totalMonthDebtFormatted);

      const daysInMonth = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0).getDate();
      const averageDaily = (totalMonthDebt / daysInMonth).toFixed(2);
      const averageDailyFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(averageDaily));
      setAverageDailyDebt(averageDailyFormatted);

      const totalDebtValue = debts.reduce((acc, debt) => acc + debt.totalValue, 0);
      setTotalDebt(totalDebtValue.toFixed(2));

      // Montar dados para o gráfico de barras
      const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // Dom a Sáb
      const initialWeekData = [0, 0, 0, 0, 0, 0, 0];

      filteredDebtsByMonth.forEach(debt => {
        const day = new Date(debt.createdAt).getDay(); // 0 (Dom) até 6 (Sáb)
        initialWeekData[day] += debt.totalValue;
      });

      const barData = initialWeekData.map((value, index) => {
        const label = weekDays[index];
        // const frontColor = ['T', 'Q', 'S'].includes(label) ? '#177AD5' : undefined;

        return {
          value: Math.round(value),
          label,
          topLabelComponent: () => (
            <Text className='text-lg text-center font-ubuntuBold text-black/90 w-[80px]'>{Math.round(value)}</Text>
          )
        };
      });

      setBarData(barData);
    }
  }, [dateSelected, customers]);


  const handleChangeDate = (date: Date) => {
    setDateSelected(new Date(date));
  };

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16'>

      <BackButton
        title='Relatório Mensal'
        onPress={() => router.back()}
      />



      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800 }}
        className='items-center bg-yellowPrimary rounded-xl py-4 justify-center elevation-md'
      >
        <DatePicker onDateChange={handleChangeDate} selectDay={false} />


      </MotiView>


      {/* <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 '
        from={{ translateX: 40, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        transition={{ duration: 700, type: 'spring', delay: 200 }}
      >
        <Text className='font-ubuntuRegular text-2xl'>Total </Text>
        <Text className='font-ubuntuBold text-[50px]'>R$132</Text>
      </MotiView> */}

      {barData.length > 0 && (
        <View className='mt-12 border-2 border-redPrimary rounded-2xl overflow-hidden py-4 elevation-lg bg-yellowPrimary'>
          <BarChart data={barData}
            key={'xyz'}
            // barMarginBottom={19}
            barBorderWidth={1}
            barBorderColor={'#24000049'}
            xAxisThickness={2}
            xAxisColor={'#461414'}
            noOfSections={5}
            rulesColor={'#4614144c'}
            isAnimated={true}
            animationDuration={1000}
            spacing={15}
            height={250}
            yAxisExtraHeight={40}
            barWidth={45}
            // adjustToWidth
            initialSpacing={0}
            frontColor={'#d03c3c'}
            barBorderRadius={5}
            hideYAxisText
            yAxisColor={`{rgba(0, 0, 0, 0)`}
            xAxisLabelTextStyle={{ color: '#000', fontWeight: '600', fontSize: 16, }}
            labelsExtraHeight={10}
          />

        </View>
      )}
      <View className='flex-row mt-4 justify-between gap-x-4'>

        <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1'
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 400 }}
        >
          {showToolTipTotalMonth && (
            <TouchableOpacity className='absolute z-10 bg-yellowPrimary p-2 rounded-xl'
              onPress={() => setShowToolTipTotalMonth(false)}
              activeOpacity={1}
            >
              <Text className='text-2xl text-black/80 text-center'>Soma dos fiados do mês selecionado</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowToolTipTotalMonth(true)}
          >

            <Text className='font-ubuntuRegular text-xl text-center'>Fiados do mês</Text>
            <Text className='font-ubuntuBold text-[25px] text-black/80'>{monthDebt}</Text>
          </TouchableOpacity>
        </MotiView>


        <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1'
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 600 }}
        >
          {/* talvez */}
          {showToolTipDailyMedia && (
            <TouchableOpacity className='absolute z-10 bg-yellowPrimary p-2 rounded-xl'
              onPress={() => setShowToolTipDailyMedia(false)}
              activeOpacity={1}
            >
              <Text className='text-2xl text-black/80 text-center'>Fiados do mês / 30</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowToolTipDailyMedia(true)}>
            <Text className='font-ubuntuRegular text-xl text-center'>Média diária</Text>
            <Text className='font-ubuntuBold text-[25px] text-center text-black/80'>{averageDailyDebt}</Text>
          </TouchableOpacity>
        </MotiView>

        {/* talvez */}
        {/* um componente bottom com o todal de fiado não pagos -dividas- */}

      </View>
      {/* <Text>fasdasd</Text> */}


    </View>
  )
}

export default ReportsPage