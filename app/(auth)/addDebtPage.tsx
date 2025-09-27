import Toast from 'react-native-toast-message'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import MaskInput, { Masks } from 'react-native-mask-input';

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { router, useLocalSearchParams } from 'expo-router'

import BackButton from '@/components/BackButton'
import ICustomModal from '@/components/CustomModal'
import NavigateButton from '@/components/NavigateButton'
import { useAuth } from '@/contexts/AuthProvider'

import { Customer, Debt, useCustomers } from '@/contexts/CustomersProvider'
import { sendMessageToWppCustomer } from '@/utils/sendMessageWpp'


const debtSchema = z.object({
  value: z.string().nonempty('Insira um valor')
})

type DebtType = z.infer<typeof debtSchema>

const AddDebtPage = () => {

  const { customerId } = useLocalSearchParams()
  const { customers } = useCustomers()

  const { user } = useAuth()
  const { createDebt } = useCustomers()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<number | null>(null)

  const [visibleModal, setVisibleModal] = useState(false)

  const { control, handleSubmit, formState: { errors, defaultValues }, reset } = useForm<DebtType>({
    resolver: zodResolver(debtSchema),
    mode: 'onChange',
  })


  useEffect(() => {
    const loadingSelectedCustomer = () => {
      const selected = customers && customers.find((customer) => customer.id === customerId)
      setSelectedCustomer(selected || null)
      setLoading(false)
    }
    loadingSelectedCustomer()
  }, [customerId])


  const handleToggleModal = () => {
    setVisibleModal(!visibleModal)
  }

  const onConfirmForm = (data: { value: string }) => {

    if (data.value) {
      const number = data.value
      const parseNumber = (parseFloat(number) / 100)

      console.log("String crua: " + number)
      console.log("Number parsed: " + parseNumber)
      setFormData(parseNumber)
      setVisibleModal(true)
    }

  }


  const onSubmit = async (data: DebtType) => {

    if (!user || !selectedCustomer) return

    const stringValue = data.value
    const parseNumber = parseFloat(stringValue) / 100

    console.log("Number parsed: " + parseNumber.toFixed(2))
    console.log("Typeof number parsed: " + typeof parseNumber)

    const newDebt: Debt = {
      createdAt: new Date(),
      createdBy: user && user.email ? user.email : "sem user",
      dueDate: null,
      isPaid: false,
      paidValue: 0,
      totalValue: parseNumber
    }

    console.log("chamando função do firebase")

    if (selectedCustomer.id) {

      try {
        await createDebt(selectedCustomer?.id, newDebt)

        Toast.show({
          type: 'success',
          text1: "Sucesso!",
          text2: `${selectedCustomer.name} comprou R$${parseNumber.toFixed(2)}`
        })



      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: `Erro ao adicionar compra. Tente novamente mais tarde.`
        })
      }

      router.back()

      sendMessageToWppCustomer({ customer: selectedCustomer, debt: newDebt })
    }

  }

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16 relative'>



      <BackButton
        onPress={() => router.back()}
        title={`Adicionar Compra`}
      />

      <Text className='text-center font-ubuntuMedium text-xl mt-12'>Quem está comprando</Text>
      <Text className='text-center font-ubuntuBold text-[35px]'>{selectedCustomer?.name}</Text>

      <Controller
        control={control}
        name="value"
        render={({ field: { onChange, value } }) => (
          <>
            <View className='bg-yellowPrimary mt-24'>
              <MaskInput
                value={value}
                onChangeText={(masked, unmasked) => {
                  // masked = "R$ 12,34"
                  // unmasked = "1234"
                  onChange(unmasked);
                }}
                mask={Masks.BRL_CURRENCY}
                keyboardType="numeric"
                style={{
                  fontSize: 50,
                  textAlign: 'center',
                  borderWidth: 2,
                  borderColor: '#C82F2F',
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: '#FFE55D',
                  width: '100%',
                }}
                placeholder='R$0.00'
              />
              <Text className='text-redPrimary mb-4 text-2xl text-center'>
                {errors.value?.message ? errors.value.message : '...'}
              </Text>
            </View>
          </>
        )}
      />

      <NavigateButton
        onPress={handleSubmit(onConfirmForm)}
        title='Salvar'
      />

      <ICustomModal
        isVisible={visibleModal}
        toggleModal={handleToggleModal}
        data={formData}
        confirm={handleSubmit(onSubmit)}
      />

    </View>
  )
}

export default AddDebtPage