import BackButton from '@/components/BackButton'
import DatePicker from '@/components/DatePicker'
import { Customer, useCustomers } from '@/contexts/CustomersProvider'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
const ReportsPage = () => {

  const { customers } = useCustomers();

  const [dateSelected, setDateSelected] = useState(new Date());

  const [yearDebts, setYearDebts] = useState("");
  const [averageMonthlyDebt, setAverageMonthlyDebt] = useState("");
  const [totalDebt, setTotalDebt] = useState("");

  const [barData, setBarData] = useState<{ value: number; label: string }[]>([]);

  const [showToolTipTotalYear, setShowToolTipTotalYear] = useState(false)
  const [showToolTipMonthlyMedia, setShowToolTipMonthlyMedia] = useState(false)


  useEffect(() => {
    if (customers) {
      const debts = customers.flatMap(customer => customer.debts || []);

      const filteredDebtsByYear = debts.filter(debt => {
        const debtDate = new Date(debt.createdAt);
        return (
          // debtDate.getMonth() === dateSelected.getMonth() &&
          debtDate.getFullYear() === dateSelected.getFullYear()
        );
      });

      const yearTotalDebts = filteredDebtsByYear.reduce((acc, debt) => acc + debt.totalValue, 0);
      const yearTotalDebtsFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(yearTotalDebts);
      setYearDebts(yearTotalDebtsFormatted);

      const monthsUntilNow = dateSelected.getMonth() + 1; // +1 porque getMonth() é zero-indexado

      const averageMonthly = (yearTotalDebts / monthsUntilNow).toFixed(2);
      const averageMonthlyFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(averageMonthly));
      setAverageMonthlyDebt(averageMonthlyFormatted);

      const totalDebtValue = debts.reduce((acc, debt) => acc + debt.totalValue, 0);
      setTotalDebt(totalDebtValue.toFixed(2));

      const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const initialMonthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      filteredDebtsByYear.forEach(debt => {
        const day = new Date(debt.createdAt).getMonth();
        initialMonthData[day] += debt.totalValue;
      });

      const barData = initialMonthData.map((value, index) => {
        const label = monthLabels[index];

        return {
          value: Math.round(value),
          label,
          topLabelComponent: () => (
            <Text className='text-lg text-center font-ubuntuBold text-black/90 w-[80px]'>{Math.round(value)}</Text>
          )
        };
      });

      setBarData(barData);
      console.log(barData)
    }
  }, [dateSelected, customers]);


  const handleChangeDate = (date: Date) => {
    setDateSelected(new Date(date));
  };

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16'>

      <BackButton
        title='Relatório Anual'
        onPress={() => router.back()}
      />



      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800 }}
        className='items-center elevation-md bg-yellowPrimary rounded-xl pt-4 justify-center'
      >
        <DatePicker onDateChange={handleChangeDate} selectDay={false} selectMonth={false} />


      </MotiView>



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
            rulesColor={'#46141410'}
            rulesThickness={5}
            isAnimated={true}
            animationDuration={1000}
            spacing={25}
            height={250}
            yAxisExtraHeight={40}
            // barWidth={55}
            adjustToWidth
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

        <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1 relative'
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 400 }}
        >

          {showToolTipTotalYear && (
            <TouchableOpacity className='absolute z-10 bg-yellowPrimary p-2 rounded-xl'
              onPress={() => setShowToolTipTotalYear(false)}
              activeOpacity={1}
            >
              <Text className='text-2xl text-black/80 text-center'>Soma de todos os fiados mensais</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowToolTipTotalYear(true)}
          >
            {/* vai mostrar o total de fiado no mes */}
            <Text className='font-ubuntuRegular text-xl text-center'>Total do ano</Text>
            <Text className='font-ubuntuBold text-[25px] text-black/80'>{yearDebts}</Text>
          </TouchableOpacity>
        </MotiView>


        <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1'
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 600 }}
        >
          {showToolTipMonthlyMedia && (
            <TouchableOpacity className='absolute z-10 bg-yellowPrimary p-2 rounded-xl'
              onPress={() => setShowToolTipMonthlyMedia(false)}
              activeOpacity={1}
            >
              <Text className='text-2xl text-black/80 text-center'>Total / meses decorridos</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowToolTipMonthlyMedia(true)}>

            <Text className='font-ubuntuRegular text-xl text-center'>Média mensal</Text>
            <Text className='font-ubuntuBold text-[25px] text-center text-black/80'>{averageMonthlyDebt}</Text>
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