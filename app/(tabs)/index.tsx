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

interface TransactionFirestoreType extends TransactionType {
  date: { nanoseconds: number; seconds: number }
}

export default function Index() {
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionType[]
  >([])

  useEffect(() => {
    db.transaction.getUserTransactions().then((transaction) => {
      const finalData: TransactionType[] = []
      transaction.forEach((value) => {
        const data = value.data() as TransactionFirestoreType
        finalData.push({
          ...data,
          date: moment(data.date.seconds * 1000).toDate(),
        } as TransactionType)
      })

      setTransactionHistory(finalData)
    })
  }, [])

  useEffect(() => {
    console.log(transactionHistory)
  }, [transactionHistory])

  return (
    <View style={[styles.container]}>
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.headerText}>This month spend</Text>
        <Text style={styles.mainHeaderText}>Rp. xxxxxxxxx</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <FontAwesome name="arrow-circle-down" color={'white'} />
          <Text style={{ color: 'white' }}>xx% less than last month</Text>
        </View>
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
              Recent transaction
            </Text>
            <Link
              href={'/profile'}
              style={{ fontWeight: '500', color: Colors.link }}
            >
              <Text>See All</Text>
            </Link>
          </View>
          <ItemList data={transactionHistory} />
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
