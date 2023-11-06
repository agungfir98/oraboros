import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import db from '../../db'
import moment from 'moment'
import {
  TransactionFirestoreType,
  TransactionQueryParams,
} from '../../db/transaction'
import ItemList from '../../components/listItem'
import { TransactionType } from '../../types/transactionType'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

const TransactionHistory = () => {
  const [queryParams, setQueryParams] = useState<TransactionQueryParams>({
    dateRange: {
      start: moment().startOf('year').toDate(),
      end: moment().endOf('year').toDate(),
    },
    orderBy: 'desc',
  })
  const [data, setData] = useState<TransactionType[]>([])

  useEffect(() => {
    db.transaction.getUserTransactions(queryParams).then((transaction) => {
      console.log('history', transaction)
      const finalData: TransactionType[] = []
      transaction.forEach((value) => {
        const data = value.data() as TransactionFirestoreType
        finalData.push({
          ...data,
          date: moment(data.date.seconds * 1000).toDate(),
        } as TransactionType)
      })
      setData(finalData)
    })
  }, [queryParams])

  return (
    <View>
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}
      >
        <View>
          <Pressable
            style={{ flexDirection: 'row', gap: 5 }}
            onPress={() => {
              setQueryParams((prev) => ({
                ...prev,
                orderBy: queryParams.orderBy === 'asc' ? 'desc' : 'asc',
              }))
            }}
          >
            {queryParams.orderBy === 'asc' && (
              <FontAwesome name="sort-amount-asc" size={18} />
            )}
            {queryParams.orderBy === 'desc' && (
              <FontAwesome name="sort-amount-desc" size={18} />
            )}
            <Text style={{ fontWeight: '600' }}>Date</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: '95%',
          backgroundColor: 'gray',
          alignSelf: 'center',
        }}
      />
      <View style={[styles.listContiner]}>
        <ItemList data={data} />
      </View>
    </View>
  )
}

export default TransactionHistory

const styles = StyleSheet.create({
  listContiner: {
    paddingHorizontal: 20,
  },
  tabs: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsText: { fontWeight: '600' },
})
