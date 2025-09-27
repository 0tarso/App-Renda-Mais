import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

import FontAwesome from '@expo/vector-icons/FontAwesome'
import NavigateButton from '../NavigateButton'

interface ICustomModal {
  isVisible: boolean
  toggleModal: () => void
  data?: any
  confirm: () => void
}


const ICustomModal = ({ isVisible, toggleModal, data, confirm }: ICustomModal) => {

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

            <View className='mt-8'>
              <Text className='text-center text-[20px]'>Você está salvando o valor de:</Text>
              <Text className='text-center text-[50px] font-ubuntuBold'>
                R$ {typeof data === "number" && data.toFixed(2)}</Text>
            </View>
            <View className="mt-6 flex-col w-full gap-y-1">
              <NavigateButton
                onPress={confirm}
                title='Confirmar'
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ICustomModal