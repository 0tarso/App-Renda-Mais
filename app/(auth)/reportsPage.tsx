import React from 'react'
import { View } from 'react-native'

import BackButton from '@/components/BackButton'
import NavigateButton from '@/components/NavigateButton'

import { router } from 'expo-router'


const ReportsPage = () => {

  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16'>

      <BackButton
        title='Relatórios'
        onPress={() => router.back()}
      />

      <View className='items-center justify-center mt-12 h-[500px]'>
        <NavigateButton
          onPress={() => router.navigate('/(auth)/monthReport')}
          title='Mensal'

        />
        <NavigateButton
          onPress={() => router.navigate('/(auth)/yearReport')}
          title='Anual'

        />

      </View>
    </View>
  )
}

export default ReportsPage