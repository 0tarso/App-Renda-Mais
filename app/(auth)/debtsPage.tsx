import { Ionicons } from '@expo/vector-icons'

import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

import DebtCard from '@/components/DebtCard'
import BackButton from '@/components/BackButton'
import DatePicker from '@/components/DatePicker'

import { router, useLocalSearchParams } from 'expo-router'
import { Customer, Debt, useCustomers } from '@/contexts/CustomersProvider'

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const DebtsPage = () => {
  const { customerId } = useLocalSearchParams();
  const { customers } = useCustomers();

  const [originalCustomer, setOriginalCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const [dateSelected, setDateSelected] = useState(new Date());
  const [actualDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(true)
  const [showTotalModal, setShowTotalModal] = useState(false)

  const [monthStringSelected, setMonthStringSelected] = useState<string>("")

  const [showAllDebts, setShowAllDebts] = useState(false)

  const handleChangeDate = (date: Date) => {
    setDateSelected(new Date(date));
  };

  // Carrega o cliente com todos os débitos
  useEffect(() => {
    const loadingSelectedCustomer = () => {
      const selected = customers?.find((customer) => customer.id === customerId);

      if (selected) {
        const sortedDebts = selected.debts
          ?.slice()
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const fullCustomer = {
          ...selected,
          debts: sortedDebts,
        };

        setOriginalCustomer(fullCustomer);
      } else {
        setOriginalCustomer(null);
        setSelectedCustomer(null);
      }

      setLoading(false);
    };

    loadingSelectedCustomer();
  }, [customerId, customers]);

  // Atualiza os débitos com base na data
  useEffect(() => {
    if (!originalCustomer) return;

    const filteredDebts = originalCustomer.debts?.filter((debt) => {
      // Comparando apenas ano e mês
      return (
        debt.createdAt.getFullYear() === dateSelected.getFullYear() &&
        debt.createdAt.getMonth() === dateSelected.getMonth() &&
        debt.createdAt.getDate() === dateSelected.getDate()
      );
    });

    setSelectedCustomer({
      ...originalCustomer,
      debts: filteredDebts,
    });
  }, [dateSelected, originalCustomer]);

  useEffect(() => {
    const month = months[dateSelected.getMonth()]
    console.log(month)

    setMonthStringSelected(month)

  }, [dateSelected])

  const getMonthTotalValue = (customer: Customer | null) => {

    if (!customer) return

    let debtTotal = 0

    if (customer.debts) {
      const total = customer.debts.reduce((acc, item) => {

        const verifyMonth = (item: Debt) => {
          const month = item.createdAt.getMonth()

          // console.log(monthString)
          if (month === dateSelected.getMonth()) {

            return item.totalValue;
          }

          return 0;
        };

        return acc + verifyMonth(item);
      }, 0);

      debtTotal = total
    }

    return debtTotal.toFixed(2)
  }

  const handleShowDatePicker = () => {
    setShowAllDebts(false);
    setShowDatePicker(!showDatePicker);
  }

  const handleShowAllDebts = () => {
    if (showAllDebts) return

    setShowDatePicker(false);
    setShowAllDebts(!showAllDebts);
  };

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16 relative'>
      <BackButton
        onPress={() => router.back()}
        title={`${selectedCustomer?.name} / Compras`}
      />

      {showDatePicker ? (

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 800 }}
          className='items-center '
        >
          <DatePicker onDateChange={handleChangeDate} selectDay={true} />

          <TouchableOpacity className='px-4 mt-2'
            onPress={() => setShowDatePicker(false)}
          >
            <Ionicons name='arrow-up' size={32} />

          </TouchableOpacity>
        </MotiView>
      ) : (
        <MotiView className='py-4 flex-row justify-around elevation-md bg-yellowPrimary rounded-2xl'
        // from={{h}}
        >
          <TouchableOpacity className='items-center'
            onPress={() => handleShowDatePicker()}
          >
            <Text className='text-black font-ubuntuBold text-center text-xl p-2 rounded-lg border-2 border-redPrimary'>Selecionar Data</Text>
            {/* <Ionicons name='arrow-down' size={32} /> */}

          </TouchableOpacity>

          <TouchableOpacity className='items-center'
            onPress={() => handleShowAllDebts()}
          >
            <Text className='text-black font-ubuntuBold text-center text-xl p-2 rounded-lg border-2 border-redPrimary'>Todos os Débitos</Text>
            {/* <Ionicons name='arrow-down' size={32} /> */}

          </TouchableOpacity>

        </MotiView>
      )}

      <View>

        {showAllDebts ? (

          <>
            {!loading && originalCustomer?.debts?.length === 0 ? (
              <Text className='text-center mt-60 font-ubuntuBold text-3xl'>
                O cliente ainda não possui débitos
              </Text>
            ) : (
              <FlatList
                className='mb-60'
                showsVerticalScrollIndicator={false}
                data={originalCustomer?.debts}
                renderItem={({ item, index }) => (
                  <DebtCard debt={item} index={index} />
                )} />
            )}
          </>

        ) : (
          <>
            {!loading && selectedCustomer?.debts?.length === 0 && (
              <Text className='text-center mt-60 font-ubuntuBold text-3xl'>
                Sem débitos neste dia
              </Text>
            )}
            <FlatList
              className='mb-60'
              showsVerticalScrollIndicator={false}
              data={selectedCustomer?.debts}
              renderItem={({ item, index }) => (
                <DebtCard debt={item} index={index} />
              )}
            />
          </>
        )}

      </View>

      {showTotalModal ? (
        <MotiView className='bg-green-600 elevation-lg p-4 absolute bottom-0 right-0 left-0 rounded-t-3xl flex-col w-screen h-32'
          from={{ bottom: -500 }}
          animate={{ bottom: 0 }}
          transition={{ duration: 1000 }}
        >
          <TouchableOpacity
            onPress={() => setShowTotalModal(false)}
            activeOpacity={0.9}
          >
            <Text className='text-2xl font-ubuntuRegular text-white'>Total gasto em {monthStringSelected}:</Text>

            <Text className='text-5xl text-white font-ubuntuBold'>R${getMonthTotalValue(originalCustomer)}</Text>
          </TouchableOpacity>
        </MotiView >

      ) : (

        <MotiView className='bg-green-600 elevation-lg p-4 absolute bottom-0 right-0 left-0 rounded-t-3xl flex-col w-screen'
          from={{ left: -500 }}
          animate={{ left: 0 }}
          transition={{ duration: 1000, delay: 1000 }}
        >
          <TouchableOpacity className=''
            onPress={() => setShowTotalModal(true)}
            activeOpacity={0.9}
          >
            <Text className='text-2xl font-ubuntuRegular text-white text-center'>Mostrar Total</Text>

          </TouchableOpacity>
        </MotiView >
      )}

    </View >
  );
};

export default DebtsPage