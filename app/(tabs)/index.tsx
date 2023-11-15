import { StyleSheet, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Link } from 'expo-router'
import ItemList from '../../components/listItem'
import { useEffect, useState } from 'react'
import db from '../../db'
import { TransactionType } from '../../types/transactionType'
import moment from 'moment'
import {
  TransactionFirestoreType,
  TransactionQueryParams,
} from '../../db/transaction'

export default function Index() {
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionType[]
  >([])
  const [queryParams] = useState<TransactionQueryParams>({
    dateRange: {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate(),
    },
    orderBy: 'desc',
  })
  const [lastMonthExpense, setLastMonthExpense] = useState<number>(0)
  const [percentExpenses, setPercentExpenses] = useState<number | undefined>()

  useEffect(() => {
    db.transaction
      .getUserTransactions(queryParams)
      .then((transaction) => {
        transaction.onSnapshot(
          (documentSnapshot) => {
            const finalData: TransactionType[] = []
            documentSnapshot.forEach((value) => {
              const data = value.data() as TransactionFirestoreType
              finalData.push({
                ...data,
                date: moment(data.date.seconds * 1000).toDate(),
              } as TransactionType)
            })
            setTransactionHistory(finalData)
          },
          (err) => {
            console.log('uerror', err)
          },
        )
      })
      .catch(() => {
        return
      })
  }, [])

  useEffect(() => {
    db.transaction
      .getLastMonthExpense()
      .then(
        (transaction) => {
          transaction.onSnapshot((documentSnapshot) => {
            const finalData: TransactionType[] = []
            documentSnapshot.forEach((value) => {
              finalData.push(value.data() as TransactionFirestoreType)
            })
            setLastMonthExpense(finalData.reduce((pv, cv) => pv + cv.price, 0))
          })
        },
        (err) => {
          console.error(err)
        },
      )
      .catch(() => {
        return
      })
  }, [])

  useEffect(() => {
    if (lastMonthExpense) {
      if (transactionHistory.length) {
        const percent =
          (transactionHistory.reduce((pv, cv) => pv + cv.price, 0) /
            lastMonthExpense -
            1) *
          100
        setPercentExpenses(parseFloat(percent.toFixed(2)))
      }
    }
  }, [lastMonthExpense, transactionHistory])

  return (
    <View style={[styles.container]}>
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.headerText}>This month's spend</Text>
        <Text style={styles.mainHeaderText}>
          Rp.{' '}
          {transactionHistory
            .reduce((pv, cv) => pv + cv.price, 0)
            .toLocaleString()}
        </Text>
        {percentExpenses && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <FontAwesome
              name={
                percentExpenses > 0 ? 'arrow-circle-up' : 'arrow-circle-down'
              }
              color={'white'}
            />
            <Text style={{ color: 'white' }}>
              {Math.abs(percentExpenses)}%{' '}
              {percentExpenses > 0 ? 'more' : 'less'} than last month
            </Text>
          </View>
        )}
      </View>
      <View style={styles.mainContent}>
        <View style={styles.budgetCard}>
          <Text style={{ fontWeight: '500' }}>Monthly budget</Text>
          <Text style={{ fontWeight: '500' }}>Rp. 2.0000.000,-</Text>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontWeight: '500', color: Colors.mute }}>
              Recent monthly transaction
            </Text>
            <Link
              href={'/(tabs)/transactionHistory'}
              style={{ fontWeight: '500', color: Colors.link }}
            >
              <Text>See All</Text>
            </Link>
          </View>
          <ItemList data={transactionHistory.slice(0, 7)} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: '30%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.textWhite,
    fontSize: 20,
    fontWeight: '500',
  },
  mainHeaderText: {
    fontSize: 35,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  budgetCard: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: 'white',
    elevation: 10,
    height: 50,
    width: '80%',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
