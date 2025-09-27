import { useAuth } from '@/contexts/AuthProvider'
import { Debt } from '@/contexts/CustomersProvider'
import { MotiText, MotiView } from 'moti'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface IDebtCard {
  debt: Debt
  index: number
}


const DebtCard = ({ debt, index }: IDebtCard) => {

  const { user } = useAuth()

  const [infoTypeDebtCard, setInfoTypeDebtCard] = useState<"onlyValue" | "details">("onlyValue")

  const getDateTimeString = (date: Date | null) => {

    // console.log(date)
    // return

    if (date === null) return "Em aberto"

    const daysOfWeek = [
      "domingo", "segunda-feira", "terça-feira",
      "quarta-feira", "quinta-feira", "sexta-feira", "sábado"
    ]

    const data = new Date(date)
    const weekDay = daysOfWeek[data.getDay()]
    const hour = String(data.getHours()).padStart(2, '0')
    const minutes = String(data.getMinutes()).padStart(2, '0')

    const capitalizedWeekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1)

    return `${capitalizedWeekDay}, ${hour}:${minutes} - ${date.getDate().toString().padStart(2, '0')}/${date.getMonth().toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  return (
    <>
      {infoTypeDebtCard === 'details' && (
        <TouchableOpacity onPress={() => setInfoTypeDebtCard('onlyValue')}>
          <MotiView className='border-2 border-redPrimary rounded-2xl p-4 mt-4'
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 500 }}
          >


            <View className='flex-row justify-between items-center'>
              <Text className='text-black font-ubuntuBold text-3xl'>R${debt.totalValue.toFixed(2)}</Text>

              {debt.isPaid && debt.isPaid ? (
                <Text className='font-ubuntuBold text-lg text-white p-2 bg-green-600 rounded-lg elevation-sm'>Pago</Text>

              ) : (
                <Text className='font-ubuntuBold text-lg text-white p-2 bg-redPrimary rounded-lg elevation-sm'>Em aberto</Text>
              )}

            </View>
            <View className='border-l-[1px] border-redPrimary pl-2'>

              {debt.isPaid === false ? (
                <>
                  <MotiText className='font-ubuntuRegular text-xl text-black/70 mt-4'
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 800, delay: index * 150 }}
                  >Pagamento: {getDateTimeString(debt.dueDate)}
                  </MotiText>

                  <MotiText className='font-ubuntuRegular text-xl text-black/70'
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 800, delay: index * 200 }}
                  >Valor Pago: {debt.paidValue.toFixed(2)}</MotiText>

                  <MotiText className='font-ubuntuRegular text-xl text-black/70'
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 800, delay: index * 220 }}
                  >Valor restante: R${(debt.totalValue - debt.paidValue).toFixed(2)}</MotiText>
                </>
              ) : (
                <>
                  <MotiText className='font-ubuntuRegular text-xl text-black/70 mt-4'
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 800, delay: index * 150 }}
                  >Pagamento: {getDateTimeString(debt.dueDate)}</MotiText>
                  {/* <Text className='font-ubuntuBold text-xl text-black/70'>
            Valor Pago: {debt.paidValue.toFixed(2)}</Text>
          <Text className='font-ubuntuBold text-xl text-black/70'>
            Valor restante: R${(debt.totalValue - debt.paidValue).toFixed(2)}</Text> */}
                </>
              )}
            </View>
            <Text className='font-ubuntuBold text-xl text-black/70 mt-4'>{getDateTimeString(debt.createdAt)}</Text>

          </MotiView>
        </TouchableOpacity>

      )}

      {infoTypeDebtCard === 'onlyValue' && (
        <TouchableOpacity onPress={() => setInfoTypeDebtCard("details")}>
          <MotiView className='border-2 border-redPrimary rounded-2xl p-4 mt-4'
            from={{ translateX: -40, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ duration: 500, delay: index * 50 }}
          >


            <View className='flex-row justify-between items-center'>
              <Text className='text-black font-ubuntuBold text-3xl'>R${debt.totalValue.toFixed(2)}</Text>

              {debt.isPaid && debt.isPaid ? (
                <Text className='font-ubuntuBold text-lg text-white p-2 bg-green-600 rounded-lg elevation-sm'>Pago</Text>

              ) : (
                <Text className='font-ubuntuBold text-lg text-white p-2 bg-redPrimary rounded-lg elevation-sm'>Em aberto</Text>
              )}

            </View>

            <Text>{user?.email}</Text>
            <Text className='font-ubuntuBold text-xl text-black/70 mt-4'>{getDateTimeString(debt.createdAt)}</Text>

          </MotiView>
        </TouchableOpacity>
      )}

    </>


  )
}

export default DebtCard