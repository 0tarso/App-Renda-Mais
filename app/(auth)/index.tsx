import { MotiImage } from 'moti'
import React, { useEffect } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

// @ts-ignore
import logoPNG from "../../assets/images/logo.png"
import NavigateButton from '@/components/NavigateButton'
import { router } from 'expo-router'
import { useAuth } from '@/contexts/AuthProvider'

const HomePage = () => {

  const { loading, handleSignOut } = useAuth()

  const handleLogout = async () => {
    try {
      await handleSignOut()
      // router.replace('../')
    } catch (error) {
      console.log("Erro ao sair")
    }
  }

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
        <NavigateButton
          onPress={() => router.navigate('/customers')}
          title='Clientes'
        />
        {/*         
        <NavigateButton
          onPress={() => console.log("pressBtnd")}
          title='Contas'
        /> */}

        <NavigateButton
          onPress={() => router.navigate('/reportsPage')}
          title='Relatórios'
        />

      </View>

      <View className=' bottom-16 left-0 right-0 absolute items-center'>
        <TouchableOpacity className=' w-1/4'
          onPress={handleLogout}
        >
          <Text className='text-center font-ubuntuBold text-3xl text-black/70'>Sair</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default HomePage