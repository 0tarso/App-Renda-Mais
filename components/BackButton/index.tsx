import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'


interface IBackButton {
  title: string
  onPress: () => void

}

const BackButton = ({ title, onPress }: IBackButton) => {
  return (
    <View className='mb-2'>
      <TouchableOpacity className='flex-row items-center'
        onPress={onPress}
      >
        <MaterialIcons name='arrow-left' size={42} />
        <Text className='text-3xl font-ubuntuBold max-w-fit'>{title}</Text>
      </TouchableOpacity>

    </View>
  )
}

export default BackButton