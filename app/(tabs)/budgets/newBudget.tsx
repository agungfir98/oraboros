import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import budget from '../../../db/budget'
import Colors from '../../../constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { FontAwesome } from '@expo/vector-icons'
import Loading from '../../../components/loading'
import { useRouter } from 'expo-router'
import { BudgetType } from '../../../types/budgetType'

const NewBudget = () => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [budgets, setBudgets] = useState<BudgetType[]>([
    {
      amount: 0,
      name: '',
      tag: '',
    },
  ])

  const handleSubmitBudget = () => {
    setLoading(true)
    budget
      .addBulkBudget(budgets)
      .then(() => {
        setBudgets([{ amount: 0, name: '', tag: '' }])
        setLoading(false)
        router.back()
      })
      .catch((err) => {
        console.error('err', err)
        setLoading(false)
      })
  }

  const handleChangeInput = (
    index: number,
    field: keyof BudgetType,
    value: any,
  ) => {
    const budgetList = [...budgets]

    if (typeof budgetList[index][field] === 'string') {
      budgetList[index][field] = value as never
      setBudgets(budgetList)
    }
    if (typeof budgetList[index][field] === 'number') {
      if (isNaN(value)) {
        budgetList[index][field] = 0 as never
        setBudgets(budgetList)
      }
      budgetList[index][field] = value as never
      setBudgets(budgetList)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <View style={[styles.container]}>
      <View style={[{ gap: 10 }]}>
        {budgets.map((v, i) => (
          <View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                paddingBottom: 20,
                gap: 5,
              },
            ]}
            key={i}
          >
            <TextInput
              value={v.name}
              placeholder="title"
              style={{ borderBottomWidth: 0.5 }}
              onChangeText={(value) => handleChangeInput(i, 'name', value)}
            />
            <TextInput
              value={v.tag}
              placeholder="tag"
              style={{ borderBottomWidth: 0.5 }}
              maxLength={5}
              onChangeText={(value) => handleChangeInput(i, 'tag', value)}
            />
            <TextInput
              value={v.amount.toString()}
              placeholder="amount"
              keyboardType="numeric"
              style={{ borderBottomWidth: 0.5 }}
              onChangeText={(value) => handleChangeInput(i, 'amount', value)}
            />
            {budgets.length > 1 && (
              <Pressable
                onPress={() =>
                  setBudgets(budgets.filter((_, index) => i !== index))
                }
                style={[
                  {
                    backgroundColor: '#fa4d4d',
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    borderRadius: 50,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  },
                ]}
              >
                <FontAwesome name="minus" color={'white'} />
              </Pressable>
            )}
          </View>
        ))}
        <Pressable
          onPress={() => {
            setBudgets([...budgets, { amount: 0, name: '', tag: '' }])
          }}
          style={[
            {
              backgroundColor: '#f59942',
              borderRadius: 50,
              paddingVertical: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[{ color: 'white', fontWeight: '600' }]}>add item</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmitBudget}
          style={[
            {
              backgroundColor: Colors.background,
              paddingVertical: 8,
              borderRadius: 50,
              alignItems: 'center',
              marginTop: 20,
            },
          ]}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>submit</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default NewBudget

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
})
