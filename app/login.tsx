import React from 'react'
import { MotiImage } from 'moti'
import { ActivityIndicator, Text, View } from 'react-native'

import LoginForm from '@/components/LoginForm'

import logoPNG from "../assets/images/logo.png"

import { useAuth } from '@/contexts/AuthProvider'

const Login = () => {

  const { loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 bg-yellowPrimary w-full items-center justify-center">
        <MotiImage
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 800 }}
          source={logoPNG}
          style={{ width: '60%', height: 200, }}
          className='mb-12'
          resizeMode="contain"
        />
        <ActivityIndicator
          size={70}
          color="#e73636"
          className="" />

      </View>
    )
  }

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 relative'>

      <View className='w-full items-center justify-center mt-24'>
        <MotiImage
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 600 }}
          source={logoPNG}
          resizeMode='contain'
          className='w-[250px] h-[200px]'
        />
      </View>

      <View className='mt-8'>
        <LoginForm />
      </View>


      <View className='absolute bottom-16 left-0 right-0'>
        <Text className='text-center font-ubuntuLight text-black/40 text-xl'>{"<"}Tailison Ramos Ruas 2025.{">"}</Text>
        <Text className='text-center font-ubuntuLight text-black/40 text-xl'>RU - 4384331 </Text>
      </View>
    </View>
  )
}

export default Login