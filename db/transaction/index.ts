import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import user from '../user'
import { TransactionType } from '../../types/transactionType'

const transactions = user.getUser().then((res) => res.docs[0])

const getUserTransactions = async (): Promise<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
> => {
  return (await transactions).ref.collection('transactions').get()
}

const createTransaction = async (data: TransactionType) => {
  return (await transactions).ref.collection('transactions').add(data)
}

export default { getUserTransactions, createTransaction }
