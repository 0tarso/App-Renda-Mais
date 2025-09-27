import { Ionicons } from '@expo/vector-icons'
import { Customer, useCustomers } from '@/contexts/CustomersProvider'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

interface ICustomerCard {
  customer: Customer
  index: number
  // deleteCustomerFn: () => void
}



const CustomerCard = ({ customer, index }: ICustomerCard) => {

  useEffect(() => {
    console.log("CustomerCard index -> ", index)

  }, [])

  const { deleteCustomer } = useCustomers()

  const [showInfoType, setShowInfoType] = useState<"customerCard" | "confirmDeleteCard">("customerCard")

  const getTotalValue = () => {

    let debtValue = 0

    if (customer.debts) {

      const total = customer.debts.reduce((acc, item) => {

        // console.log(item)

        if (!item) return acc;

        const verifyIsPaid = (paidValue: number, totalValue: number) => {
          if (paidValue === totalValue) {
            return 0;
          }

          // console.log(totalValue - paidValue)

          // You may want to return the remaining value if not paid
          return totalValue - paidValue;
        };
        return acc + verifyIsPaid(item.paidValue, item.totalValue);
      }, 0);

      debtValue = total
    }

    // console.log(debtValue)

    return debtValue.toFixed(2)

  }


  const handleNavigateToCustomerPage = (customerId?: string) => {

    if (customerId) {
      router.push({
        pathname: '/customerPage',
        params: {
          customerId
        }
      })
    }
  }

  const handleDeleteCustomer = async (customerId: string | undefined) => {
    if (!customerId) return

    try {
      await deleteCustomer(customerId)

      Toast.show({
        type: 'success',
        text1: "Sucesso",
        text2: `Cliente ${customer.name} deletado.`
      })


    } catch (error) {

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao deletar. Tente mais tarde!"
      })

      console.log(error)
    }
  }

  const handleChangeTypeInfoCard = (typeInfo: "customerCard" | "confirmDeleteCard") => {
    setShowInfoType(typeInfo)
  }


  return (

    <>
      {showInfoType === 'customerCard' && (
        <MotiView
          from={{ translateX: 40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ duration: 700, type: 'spring', delay: 20 * index }}
        >

          <TouchableOpacity className='p-4 border-2 rounded-2xl border-redPrimary mt-4 bg-yellowPrimary h-32 justify-center'
            onPress={() => handleNavigateToCustomerPage(customer.id)}
          >
            <View className='flex-row justify-between'>
              <Text className='font-ubuntuBold text-3xl'>{customer.name}</Text>

              <TouchableOpacity className='pl-4'
                onPress={() => handleChangeTypeInfoCard('confirmDeleteCard')}
              >
                <Ionicons name='trash' size={32} color="#6a0a0a" />
              </TouchableOpacity>

            </View>

            <View className='flex-row mt-[5px]'>
              <Text className='font-ubuntuBold text-2xl text-black/70'>Saldo devedor: R$</Text>
              <Text className='font-ubuntuBold text-2xl text-black/70'>{getTotalValue()}</Text>
            </View>

          </TouchableOpacity>
        </MotiView>
      )}

      {showInfoType === 'confirmDeleteCard' && (
        <MotiView className='p-4 border-2 rounded-2xl border-redPrimary mt-4 bg-redPrimary items-center justify-between h-56 elevation-lg'

          from={{ opacity: 0, height: 20 }}
          animate={{ opacity: 1, height: 250 }}
          transition={{ duration: 700 }}

        >
          <Text className='text-white text-2xl text-left w-full'>Você deseja excluir:</Text>
          <Text className='font-ubuntuBold text-3xl text-white text-left w-full'>{customer.name} ?</Text>

          <View className=' w-full mt-2'>

            <TouchableOpacity className='bg-green-500 p-4 rounded-xl' onPress={() => handleDeleteCustomer(customer.id)}>
              <Text className='text-center font-ubuntuBold text-2xl text-white'>Sim</Text>
            </TouchableOpacity>


            <TouchableOpacity className='bg-red-900 p-4 rounded-xl mt-4' onPress={() => handleChangeTypeInfoCard('customerCard')}>
              <Text className='text-center font-ubuntuBold text-2xl text-white'>Não</Text>
            </TouchableOpacity>

          </View>
        </MotiView>
      )}
    </>

  )
}

export default CustomerCard