import { useCustomers } from '@/contexts/CustomersProvider'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

interface IButtonApp {
  title: string
  disabledTitle?: string
  onPress: () => void
  disabled?: boolean
  bgColor?: string

}

const NavigateButton = (props: IButtonApp) => {

  const { loading } = useCustomers()


  const backgroundClass = props.bgColor ? `bg-[${props.bgColor}]` : 'bg-yellowPrimary'
  const classNames = `w-full h-[60px] elevation-sm active:elevation-none group rounded-3xl mt-4 items-center justify-center border-2 border-redPrimary ${backgroundClass} active:border-white active:bg-white`

  // console.log(classNames)

  if (props.disabled) {
    return (
      <TouchableOpacity onPress={props.onPress}
        disabled={true}
        className='w-full h-[60px] elevation-sm active:elevation-none group rounded-3xl mt-4 items-center justify-center border-2 border-redPrimary bg-yellowPrimary active:border-white active:bg-white'
      >
        <Text className='text-black/30 font-ubuntuLight text-2xl'>
          {props.disabledTitle}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={props.onPress}
      className={classNames}
      activeOpacity={0.3}
    >

      {loading ? (
        <ActivityIndicator size={32} color="#ff3636aa" />
      ) : (

        <Text className='text-black/70 font-ubuntuBold text-3xl group-active:text-white'>
          {props.title}
        </Text>

      )}
    </TouchableOpacity>
  )
}

export default NavigateButton