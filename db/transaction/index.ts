import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import user from '../user'
import { TransactionType } from '../../types/transactionType'
import moment from 'moment'

const transactions = user.getUser().then((res) => res.docs[0])

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
  return (await transactions).ref
    .collection('transactions')
    .where('date', '>', dateRange?.start)
    .where('date', '<', dateRange?.end)
    .orderBy('date', orderBy ? orderBy : 'desc')
    .get()
}

const getLastMonthExpense = async (): Promise<number> => {
  const data = (await transactions).ref
    .collection('transactions')
    .where('date', '>', moment().subtract(1, 'month').startOf('month').toDate())
    .where('date', '<', moment().subtract(1, 'month').endOf('month').toDate())
    .get()
    .then((res) => {
      const finalData: TransactionType[] = []
      res.forEach((v) => {
        finalData.push(v.data() as TransactionType)
      })
      return finalData.reduce((pv, cv) => pv + cv.price, 0)
    })
  return data
}

const createTransaction = async (data: TransactionType) => {
  return (await transactions).ref.collection('transactions').add(data)
}

export default { getUserTransactions, createTransaction, getLastMonthExpense }
