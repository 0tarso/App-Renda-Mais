import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FontAwesome } from '@expo/vector-icons'
import NavigateButton from '../NavigateButton'
import { useAuth } from '@/contexts/AuthProvider'

const loginFormSchema = z.object({
  email: z.string().nonempty('Email inválido').email('Email inválido'),
  password: z.string().nonempty('Senha inválida'),
})

type LoginFormType = z.infer<typeof loginFormSchema>

const LoginForm = () => {

  const { handleSignIn } = useAuth()

  const { control, handleSubmit, formState: { errors, defaultValues }, reset } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const fnShowPassword = () => {
    setShowPassword(!showPassword)
  }



  const onSubmit = async (data: LoginFormType) => {

    console.log(data)

    try {
      handleSignIn(data.email, data.password)

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <View>
      <View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View className='border-2 border-redPrimary rounded-2xl elevation-md bg-yellowPrimary'>
                <TextInput
                  className="px-4 w-full text-2xl font-outfitRegular  text-black"
                  placeholder="seuemail@email.com"
                  placeholderTextColor={'#555555f9'}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              <Text className='text-redPrimary mb-4'>{errors.email?.message ? errors.email.message : '...'}</Text>
            </>
          )}
        />
      </View>

      <View className='relative'>
        <TouchableOpacity className='absolute right-4 top-3 w-10 items-end z-30'
          onPress={fnShowPassword}
        >
          <FontAwesome
            name={showPassword ? 'eye' : 'eye-slash'}
            onPress={fnShowPassword}
            color={'#050505'}
            size={24}
          />
        </TouchableOpacity>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View className='px-4 border-2 border-redPrimary rounded-2xl elevation-md bg-yellowPrimary'>
                <TextInput
                  className="w-full text-2xl font-outfitRegular  text-black"
                  placeholder="************"
                  placeholderTextColor={'#555555f9'}
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
              <Text className='text-redPrimary mb-12'>{errors.password?.message ? errors.password.message : '...'}</Text>
            </>
          )}
        />

      </View>

      <NavigateButton
        onPress={handleSubmit(onSubmit)}
        title='Entrar'
      />
    </View>
  )
}

export default LoginForm