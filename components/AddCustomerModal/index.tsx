import FontAwesome from '@expo/vector-icons/FontAwesome'
import Toast from 'react-native-toast-message'

import React, { useEffect, useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { MotiView } from 'moti'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { router } from 'expo-router'
import NavigateButton from '../NavigateButton'

import { Customer, useCustomers } from '@/contexts/CustomersProvider'

interface IAddCustomerModal {
  isVisible: boolean
  toggleModal: () => void
  data?: any
  confirm: () => void
  customer?: Customer | null
}

const customerSchema = z.object({
  name: z.string().nonempty("Insira o nome")
})

type CustomerType = z.infer<typeof customerSchema>


const AddCustomerModal = ({ isVisible, toggleModal, data, confirm, customer }: IAddCustomerModal) => {
  const { createCustomer } = useCustomers()

  useEffect(() => {

    if (isVisible === false) {
      console.log("não está visível")
      setConfirmBtn('First')
      setFormData(null)
    }
  }, [isVisible])

  const [formData, setFormData] = useState<Omit<Customer, "id" | "debts" | "note" | "createdAt"> | null>(null)


  const [confirmBtn, setConfirmBtn] = useState<"First" | "Confirm">("First")

  const { control, handleSubmit, formState: { errors, defaultValues }, reset } = useForm<CustomerType>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange',
  })


  const onSubmit = async (data: CustomerType, confirmStep: "First" | "Confirm") => {

    if (!data.name) return

    if (confirmStep === "First") {

      console.log("Primeiro passo")

      setConfirmBtn("Confirm")
      setFormData(data)

      return
    }

    if (confirmStep === 'Confirm') {
      const newCustomer: Omit<Customer, "id" | "debts" | "note"> = {
        name: data.name,
        createdAt: new Date()
      }

      console.log(newCustomer)

      try {
        const customerId = await createCustomer(newCustomer)

        toggleModal()

        router.push({
          pathname: '/customerPage',
          params: {
            customerId
          }
        })

        Toast.show({
          autoHide: true,
          type: "success",
          text1: 'Sucesso!',
          text2: `Novo cliente adicionado: ${newCustomer.name}`,

        })

      } catch (error) {
        Toast.show({
          autoHide: true,
          type: 'error',
          text1: 'Erro!',
          text2: `Erro ao adicionar cliente. Tente mais tarde`
        })

        console.log(error)
      }

      // console.log("Cliente criado ")
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
                <Text className='text-center text-[20px]'>Adicionar o cliente:</Text>
                <Text className='font-ubuntuBold text-3xl text-center'>{customer?.name}</Text>

                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <View className='bg-yellowPrimary mt-2'>
                        <TextInput
                          onChangeText={onChange}
                          value={value}
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            borderWidth: 2,
                            borderColor: '#C82F2F',
                            padding: 10,
                            borderRadius: 20,
                            backgroundColor: '#FFE55D',
                            width: '100%',
                          }}
                          placeholder='Nome do cliente'
                        />
                        <Text className='text-redPrimary mb-4 text-2xl text-center'>
                          {errors.name?.message ? errors.name.message : '...'}
                        </Text>
                      </View>
                    </>
                  )}
                />

                <NavigateButton
                  onPress={handleSubmit((formData) => onSubmit(formData, 'First'))}
                  title='Continuar'
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
                    <Text className='font-ubuntuBold text-2xl text-center text-white'>Cliente a ser adicionado:</Text>
                    <Text className='font-ubuntuBold text-[40px] text-center text-white'>{formData?.name}</Text>

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

export default AddCustomerModal