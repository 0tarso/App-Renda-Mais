import FontAwesome from '@expo/vector-icons/FontAwesome'
import Toast from 'react-native-toast-message'


import MaskInput, { Masks } from 'react-native-mask-input'
import React, { useEffect, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { MotiView } from 'moti'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import NavigateButton from '../NavigateButton'
import { useAuth } from '@/contexts/AuthProvider'
import { Customer, Payment, useCustomers } from '@/contexts/CustomersProvider'

interface IPaymentModal {
  isVisible: boolean
  toggleModal: () => void
  data?: any
  confirm: () => void
  customer?: Customer | null
  debtTotal: string
}

const paymentSchema = z.object({
  value: z.string().nonempty("Insira o valor")
})

type PaymentType = z.infer<typeof paymentSchema>


const AddPaymentModal = ({ isVisible, toggleModal, data, confirm, customer, debtTotal }: IPaymentModal) => {
  const { user } = useAuth()
  const { createPayment } = useCustomers()

  useEffect(() => {

    if (isVisible === false) {
      console.log("não está visível")
      setConfirmBtn('First')
      setFormData(null)
    }
  }, [isVisible])

  const [formData, setFormData] = useState<number | null>(null)


  const [confirmBtn, setConfirmBtn] = useState<"First" | "Confirm">("First")

  const { control, handleSubmit, formState: { errors, defaultValues }, reset } = useForm<PaymentType>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
  })

  const handleCreatePayment = async (amountToApply: number, customerId: string, createdBy: string) => {
    await createPayment(customerId, amountToApply, createdBy)

    toggleModal()
  }

  const onSubmit = async (data: PaymentType, confirmStep: "First" | "Confirm") => {

    if (!user || !customer) return

    if (!data.value) return

    const stringValue = data.value
    const parseNumber = parseFloat(stringValue) / 100


    if (confirmStep === "First") {
      console.log("Number parsed: " + parseNumber.toFixed(2))
      console.log("Typeof number parsed: " + typeof parseNumber)

      if (parseNumber > Number(debtTotal)) {
        toggleModal()

        Toast.show({
          type: 'info',
          text1: 'Valor incorreto',
          text2: 'Maior do que o valor devido'
        })

        return
      }

      setFormData(parseNumber)
      setConfirmBtn('Confirm')
      return
    }

    if (confirmStep === 'Confirm' && customer.id && user.email) {
      const newPayment: Payment = {
        createdAt: new Date(),
        value: parseNumber,
        createdBy: user && user.email ? user.email : "sem user",
      }


      try {
        await handleCreatePayment(parseNumber, customer.id, user.email)

        Toast.show({
          type: 'success',
          text1: "Sucesso",
          text2: `${customer.name} pagou R$${parseNumber.toFixed(2)}`
        })
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: "Erro!",
          text2: `Erro ao criar pagamento. Tente mais tarde!`
        })
      }
      console.log("Pagamento criado com sucesso")
    }
  }


  return (
    <View className='flex-1 justify-center items-center z-40'>

      <Modal
        animationType="fade"
        hardwareAccelerated
        transparent={true}
        visible={isVisible}
        onRequestClose={toggleModal}
      >
        <View className='flex-1 justify-center items-center bg-black/80 px-2'>


          <View className='w-full p-8 bg-brownPrimary rounded-tl-xl rounded-br-2xl elevation-2xl items-center max-h-[80%] relative bg-yellowPrimary'>

            <TouchableOpacity className='absolute right-3 top-3'
              onPress={toggleModal}
            >
              <FontAwesome name='close' size={22} color="#05050598" />
            </TouchableOpacity>

            {confirmBtn === 'First' && (

              <View className='mt-8 w-full'>
                <Text className='text-center text-[20px]'>Baixar da conta de:</Text>
                <Text className='font-ubuntuBold text-3xl text-center'>{customer?.name}</Text>

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
                  onPress={handleSubmit((formData) => onSubmit(formData, 'First'))}
                  title='Baixar'
                />

              </View>
            )}

            {confirmBtn === 'Confirm' && (
              <View className="mt-6 flex-col w-full gap-y-1">
                <View>
                  <MotiView className='bg-green-500 p-2 py-8 rounded-xl elevation-sm mb-12'
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 800 }}
                  >
                    {/* <Text className='text-center font-ubuntuBold text-2xl'>Confirme abaixo</Text> */}
                    <Text className='font-ubuntuBold text-2xl text-center text-white'>Valor a ser baixado:</Text>
                    <Text className='font-ubuntuBold text-[40px] text-center text-white'>R${formData?.toFixed(2)}</Text>

                  </MotiView>
                  <NavigateButton
                    onPress={handleSubmit((formData) => onSubmit(formData, 'Confirm'))}
                    title='Confirmar'
                  />

                  <NavigateButton
                    onPress={() => setConfirmBtn('First')}
                    title='Voltar'
                  />
                </View>
              </View>
            )}



          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AddPaymentModal