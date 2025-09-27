import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Linking, Text, TextInput } from 'react-native'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { router, useLocalSearchParams } from 'expo-router'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Customer, Debt, useCustomers } from '@/contexts/CustomersProvider'

import BackButton from '@/components/BackButton'
import NavigateButton from '@/components/NavigateButton'
import { sendMessageToWppCustomer } from '@/utils/sendMessageWpp'


const updateDataSchema = z.object({
  cpf: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{11}$/.test(val),
      { message: 'CPF deve conter 11 dígitos' }
    ),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10,11}$/.test(val),
      { message: 'Telefone deve conter 10 ou 11 dígitos' }
    ),
})

type UpdateDataType = z.infer<typeof updateDataSchema>

const CustomerDetails = () => {

  const { control, handleSubmit, formState: { errors, defaultValues }, reset } = useForm<UpdateDataType>({
    resolver: zodResolver(updateDataSchema),
    mode: 'onChange',
  })
  const { customerId } = useLocalSearchParams();
  const { customers, updateCustomerContact } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const [cpfPlaceholder, setCpfPlaceholder] = useState<string>('')
  const [phonePlaceholder, setPhonePlaceholder] = useState<string>('')

  useEffect(() => {
    const loadingSelectedCustomer = () => {
      const selected = customers && customers.find((customer) => customer.id === customerId)
      setSelectedCustomer(selected || null)
      setLoading(false)
    }
    loadingSelectedCustomer()
  }, [customerId])

  useEffect(() => {
    if (selectedCustomer) {
      console.log('Selected Customer:', selectedCustomer)

      setCpfPlaceholder(selectedCustomer.cpf || 'CPF não cadastrado')
      setPhonePlaceholder(selectedCustomer.phone || 'Telefone não cadastrado')

    }
  }, [selectedCustomer])

  const onSubmit = async (data: UpdateDataType) => {
    try {
      if (!selectedCustomer || !selectedCustomer.id) return;

      const updatedCustomer: Partial<UpdateDataType> = {}

      if (data.cpf) updatedCustomer.cpf = data.cpf
      if (data.phone) updatedCustomer.phone = data.phone

      if (Object.keys(updatedCustomer).length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Nenhum dado!',
          text2: 'Preencha pelo menos um campo para atualizar.',
        })
        return;
      }

      await updateCustomerContact(selectedCustomer.id, updatedCustomer)

      Toast.show({
        type: 'success',
        text1: 'Dados atualizados!',
        text2: 'Os dados do cliente foram atualizados com sucesso.'
      })

      router.back()

    } catch (error) {
      console.log(error)
    }
  }

  const handleSendMessageToWpp = () => {
    if (!selectedCustomer) return;

    const message = `Olá, ${selectedCustomer.name || 'Cliente'}! Tudo bem com você?`

    sendMessageToWppCustomer({ customer: selectedCustomer, message })
  }

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16 relative'>
      <BackButton
        onPress={() => router.back()}
        title={`Dados do Cliente`}
      />


      <View className='mt-12'>
        <Text className='text-center text-black text-5xl font-ubuntuBold'>
          {selectedCustomer?.name}
        </Text>
      </View>

      <View className='mt-8 relative flex-1'>
        <View>

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text className='font-ubuntuBold text-black text-3xl pl-4'>CPF</Text>
                <View className='border-2 border-redPrimary rounded-2xl elevation-md bg-yellowPrimary'>
                  <TextInput
                    className="px-4 w-full text-2xl font-outfitRegular  text-black"
                    placeholder={cpfPlaceholder}
                    placeholderTextColor={'#555555f9'}
                    onChangeText={onChange}
                    value={value}
                    keyboardType='phone-pad'
                  />
                </View>
                <Text className='text-redPrimary text-xl text-center mb-4 bg-white/20 rounded-xl'>{errors.cpf?.message ? errors.cpf.message : ''}</Text>
              </>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text className='font-ubuntuBold text-black text-3xl pl-4'>Telefone</Text>
                <View className='border-2 border-redPrimary rounded-2xl elevation-md bg-yellowPrimary'>
                  <TextInput
                    className="px-4 w-full text-2xl font-outfitRegular  text-black"
                    placeholder={phonePlaceholder}
                    placeholderTextColor={'#555555f9'}
                    onChangeText={onChange}
                    value={value}
                    keyboardType='phone-pad'
                  />
                </View>
                <Text className='text-redPrimary text-xl text-center mb-4 bg-white/20 rounded-xl'>{errors.phone?.message ? errors.phone.message : ''}</Text>
              </>
            )}
          />
        </View>
        <View className='absolute bottom-24 left-0 right-0'>
          <NavigateButton
            onPress={() => handleSendMessageToWpp()}
            title='Enviar Mensagem'
          />
          <NavigateButton
            onPress={handleSubmit(onSubmit)}
            title='Salvar Dados'
          />

        </View>
      </View>


    </View>

  )
}

export default CustomerDetails