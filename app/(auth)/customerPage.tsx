import { MotiView } from 'moti'
import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { router } from 'expo-router'
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks'

import BackButton from '@/components/BackButton'
import NavigateButton from '@/components/NavigateButton'
import AddPaymentModal from '@/components/AddPaymentModal'

import { Customer, useCustomers } from '@/contexts/CustomersProvider'

const customerPage = () => {

  const { customerId } = useLocalSearchParams()
  const { customers } = useCustomers()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const [visibleModal, setVisibleModal] = useState(false)
  const [disablePaymentBtn, setDisablePaymentBtn] = useState(false)

  const [totalPurchase, setTotalPurchase] = useState("")
  const [monthlyMedia, setMonthlyMedia] = useState("")
  const [totalDebt, setTotalDebt] = useState("")


  const handleToggleModal = () => {
    setVisibleModal(!visibleModal)
  }

  useEffect(() => {
    const loadingSelectedCustomer = () => {
      const selected = customers && customers.find((customer) => customer.id === customerId)
      setSelectedCustomer(selected || null)
      setLoading(false)
    }
    loadingSelectedCustomer()
  }, [customerId, customers])

  useEffect(() => {

    if (selectedCustomer) {
      const purchase = getDebtOperations(selectedCustomer, 'total')
      const monthly = getDebtOperations(selectedCustomer, 'monthlyMedia')
      const total = getDebtOperations(selectedCustomer, 'debtTotal')

      if (Number(total) <= 0) {
        setDisablePaymentBtn(true)
      } else {
        setDisablePaymentBtn(false)
      }

      setMonthlyMedia(monthly || "")
      setTotalDebt(total || "")
      setTotalPurchase(purchase || "")
    }

  }, [selectedCustomer])

  const handleNavigate = (routeName: string, customerId?: string) => {

    if (!customerId) return

    switch (routeName) {

      case "debtsPage":
        router.push({
          pathname: '/debtsPage',
          params: {
            customerId
          }
        })
        break

      case "addDebt":
        router.push({
          pathname: '/addDebtPage',
          params: {
            customerId
          }
        })
        break

      case "customerDetails":
        router.push({
          pathname: '/customerDetails',
          params: {
            customerId
          }
        })
        break
    }
  }


  const getDebtOperations = (customer: Customer, operation: "total" | "monthlyMedia" | "debtTotal") => {

    let allTotalPurchases = 0

    let debtTotal = 0

    if (customer.debts) {
      const total = customer.debts.reduce((acc, item) => acc + item.totalValue, 0)

      allTotalPurchases = total
    }

    switch (operation) {

      case "total":
        return allTotalPurchases.toFixed(2)

      case "monthlyMedia":
        return (allTotalPurchases / 30).toFixed(2)

      case "debtTotal":

        if (customer.debts) {
          const total = customer.debts.reduce((acc, item) => {

            // console.log(item)

            if (!item) return acc;

            const verifyIsPaid = (paidValue: number, totalValue: number) => {
              if (paidValue === totalValue) {
                return 0;
              }

              return totalValue - paidValue;
            };
            return acc + verifyIsPaid(item.paidValue, item.totalValue);
          }, 0);

          debtTotal = total

          if (debtTotal == 0) {
            setDisablePaymentBtn(true)
          }

          return debtTotal.toFixed(2)
        }
    }

  }

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16 relative'>
      <BackButton
        onPress={() => router.back()}
        title={`${selectedCustomer?.name}`}
      />

      <View className='mt-4 '>

        <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 '
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 200 }}
        >
          <Text className='font-ubuntuRegular text-2xl'>Saldo devedor</Text>
          <Text className='font-ubuntuBold text-[50px]'>R${totalDebt}</Text>
        </MotiView>

        <View className='flex-row mt-4 justify-between gap-x-4'>
          <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1'
            from={{ translateX: 40, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ duration: 700, type: 'spring', delay: 400 }}
          >
            <Text className='font-ubuntuRegular text-xl'>Total até agora</Text>
            <Text className='font-ubuntuBold text-[25px] text-black/80'>R${totalPurchase}</Text>
          </MotiView>


          <MotiView className='border-2 border-redPrimary rounded-2xl items-center justify-center py-6 flex-1'
            from={{ translateX: 40, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ duration: 700, type: 'spring', delay: 600 }}
          >
            <Text className='font-ubuntuRegular text-xl text-center'>Média diária</Text>
            <Text className='font-ubuntuBold text-[25px] text-center text-black/80'>R${monthlyMedia}</Text>
          </MotiView>

        </View>

        <AddPaymentModal
          isVisible={visibleModal}
          toggleModal={handleToggleModal}
          confirm={() => console.log("confirmando")}
          customer={selectedCustomer}
          debtTotal={totalDebt}
        />

      </View>

      <View className='absolute bottom-24 right-0 left-0 px-4'>
        <NavigateButton
          onPress={handleToggleModal}
          title='Dar Baixa de Valor'
          disabled={disablePaymentBtn}
          disabledTitle='Dar Baixa de Valor'
        // bgColor={`'#6fc73c'`}
        />
        <NavigateButton
          onPress={() => handleNavigate("addDebt", selectedCustomer?.id)}
          title='Adicionar Compra'
        // bgColor={`'#6fc73c'`}
        />
        <NavigateButton
          onPress={() => handleNavigate("debtsPage", selectedCustomer?.id)}
          title='Ver histórico'
        />

        <NavigateButton
          onPress={() => handleNavigate("customerDetails", selectedCustomer?.id)}
          title='Editar Dados'
        />

      </View>
    </View>
  )
}

export default customerPage