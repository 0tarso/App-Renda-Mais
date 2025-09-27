import { MotiView } from 'moti'
import React, { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'


import { MaterialIcons } from "@expo/vector-icons"
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { router } from 'expo-router'

import BackButton from '@/components/BackButton'
import CustomerCard from '@/components/CustomerCard'
import AddCustomerModal from '@/components/AddCustomerModal'

import { useCustomers } from '@/contexts/CustomersProvider'


export default function CustomersPage() {

  const { customers, loading } = useCustomers()

  const [addCustomerVisible, setAddCustomerVisible] = useState(false)


  return (
    <View className='bg-yellowPrimary flex-1 h-full justify-start px-4 pt-16'>



      <View className='flex-row justify-between items-center '>
        <BackButton
          onPress={() => router.back()}
          title='Clientes'
        />

        <MotiView
          from={{ translateY: -50 }}
          animate={{ translateY: 0 }}
          transition={{ duration: 3000, type: 'spring' }}
        >
          <TouchableOpacity className='bg-redPrimary rounded-md'
            onPress={() => setAddCustomerVisible(true)}
          >
            <MaterialIcons name='add' size={32} color={"#fafafa"} />
          </TouchableOpacity>
        </MotiView>

      </View>

      {loading && (
        <View className='flex-1 items-center justify-center'>
          <FontAwesome name='spinner' size={32} color='#a70606' />
        </View>
      )}

      {(customers?.length ?? 0) > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          className=''
          decelerationRate={0.99}

          data={customers}
          renderItem={({ item, index }) => (
            <CustomerCard
              index={index}
              customer={item}
              key={item.id}
            />
          )}
        />
      ) : (
        <Text className='text-center mt-60 font-ubuntuBold text-3xl'>Ainda sem clientes cadastrados</Text>
      )}

      {addCustomerVisible && (
        <AddCustomerModal
          confirm={() => console.log("confirmado")}
          isVisible={addCustomerVisible}
          toggleModal={() => setAddCustomerVisible(!addCustomerVisible)}

        />
      )}


    </View>
  )
}
