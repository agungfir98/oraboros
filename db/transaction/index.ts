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
  dateRange,
}: TransactionQueryParams): Promise<
  FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
> => {
  const userDB = await getUserDB()

  return userDB.docs[0].ref
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
}

const getLastMonthExpense = async (): Promise<
  FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
> => {
  const userDB = await getUserDB()
  return userDB.docs[0].ref
    .collection('transactions')
    .where('date', '>', moment().subtract(1, 'month').startOf('month').toDate())
    .where('date', '<', moment().subtract(1, 'month').endOf('month').toDate())
}

const createTransaction = async (data: TransactionType) => {
  return getUserDB().then((snapshot) => {
    snapshot.docs[0].ref.collection('transactions').add(data)
  })
}

export default { getUserTransactions, getLastMonthExpense, createTransaction }
