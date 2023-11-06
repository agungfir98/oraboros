import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import user from '../user'
import { TransactionType } from '../../types/transactionType'
import moment from 'moment'

const getUserDB = async (): Promise<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
> => {
  return user.getUser().then((user) => {
    if (!user) {
      console.log('user not found')
      return
    }
    return user
  }) as Promise<
    FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
  >
}

export interface TransactionFirestoreType extends TransactionType {
  date: { nanoseconds: number; seconds: number }
}

export interface TransactionQueryParams {
  limit?: number
  orderBy?: 'asc' | 'desc'
  dateRange?: {
    start: Date
    end: Date
  }
}

const getUserTransactions = async ({
  orderBy,
  limit,
  dateRange,
}: TransactionQueryParams): Promise<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
> => {
  return getUserDB().then((snapshot) => {
    return snapshot.docs[0].ref
      .collection('transactions')
      .where(
        'date',
        '>',
        dateRange ? dateRange.start : moment().startOf('month').toDate(),
      )
      .where(
        'date',
        '<',
        dateRange ? dateRange.end : moment().endOf('month').toDate(),
      )
      .orderBy('date', orderBy ? orderBy : 'desc')
      .get()
  })
}

const getLastMonthExpense = async (): Promise<number | undefined> => {
  return getUserDB().then((snapshot) => {
    return snapshot.docs[0].ref
      .collection('transactions')
      .where(
        'date',
        '>',
        moment().subtract(1, 'month').startOf('month').toDate(),
      )
      .where('date', '<', moment().subtract(1, 'month').endOf('month').toDate())
      .get()
      .then((res) => {
        const finalData: TransactionType[] = []
        if (!res.docs.length) {
          return undefined
        }
        res.forEach((v) => {
          finalData.push(v.data() as TransactionType)
        })
        return finalData.reduce((pv, cv) => pv + cv.price, 0)
      })
  }) as Promise<number | undefined>
}

const createTransaction = async (data: TransactionType) => {
  return getUserDB().then((snapshot) => {
    snapshot.docs[0].ref.collection('transactions').add(data)
  })
}

export default { getUserTransactions, getLastMonthExpense, createTransaction }
