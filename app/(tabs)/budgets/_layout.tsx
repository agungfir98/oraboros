import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Stack, router, useFocusEffect, useNavigation } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '../../../constants/Colors'

const BudgetLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: 'white',
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Budgets',
        }}
      />
      <Stack.Screen
        name="newBudget"
        options={{
          headerTitle: 'add budget',
          headerLeft(props) {
            return (
              <Pressable
                onPress={router.back}
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                  },
                ]}
              >
                <FontAwesome
                  name="angle-left"
                  size={30}
                  color={'white'}
                  style={{ paddingLeft: 5 }}
                />
                <Text
                  style={[{ fontWeight: '600', color: 'white', fontSize: 16 }]}
                >
                  Back
                </Text>
              </Pressable>
            )
          },
        }}
      />
    </Stack>
  )
}

export default BudgetLayout

const styles = StyleSheet.create({})
