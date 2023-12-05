import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Link } from 'expo-router'
import budget from '../../../db/budget'
import { BudgetType } from '../../../types/budgetType'

const Budgets = () => {
  const [budgetList, setBudgetList] = useState<BudgetType[]>([])

  useEffect(() => {
    budget.getBudgets().then((snapshot) => {
      snapshot.onSnapshot((res) => {
        const data: BudgetType[] = []
        res.forEach((item) => {
          data.push(item.data() as BudgetType)
        })
        setBudgetList(data)
      })
    })
  }, [])

  return (
    <View style={[styles.container]}>
      <View
        style={[
          { marginVertical: 10, paddingHorizontal: 10, alignItems: 'flex-end' },
        ]}
      >
        <Link
          href={'/budgets/newBudget'}
          style={[
            {
              backgroundColor: Colors.background,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              elevation: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            },
          ]}
        >
          <FontAwesome name="plus" color={'white'} />
          <Text style={[{ color: 'white', fontWeight: '600' }]}>Budget</Text>
        </Link>
      </View>
      <ScrollView>
        <View style={[styles.budgetContainer]}>
          {budgetList.map((v, i) => {
            return (
              <View style={[styles.budgetCard]} key={i}>
                <View style={[{ gap: 10 }]}>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                    ]}
                  >
                    <Text style={[{ fontWeight: '600' }]}>{v.name}</Text>
                    <Text style={[{ color: Colors.mute, fontWeight: '600' }]}>
                      {v.tag}
                    </Text>
                  </View>
                  <View
                    style={[
                      { justifyContent: 'space-between', flexDirection: 'row' },
                    ]}
                  >
                    <Text style={[{ fontWeight: '600' }]}>sisa budget:</Text>
                    <Text style={[{ fontWeight: '600', color: 'red' }]}>
                      Rp. {v.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default Budgets

const styles = StyleSheet.create({
  container: {},
  budgetContainer: {
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 180,
  },
  budgetCard: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'relative',
    elevation: 2,
  },
})
