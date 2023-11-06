import { Text, Pressable } from 'react-native'
import { Stack, router } from 'expo-router'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '../../constants/Colors'

const TransactionLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="transactionHistory"
        options={{
          headerTitle: 'Transaction History',
          headerTitleStyle: {
            color: 'white',
          },
          headerLeft: (props) => (
            <Pressable
              onPress={router.back}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <FontAwesome name="angle-left" size={30} color={'white'} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                Back
              </Text>
            </Pressable>
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.background,
          },
        }}
      />
    </Stack>
  )
}

export default TransactionLayout
