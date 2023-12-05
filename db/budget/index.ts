import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import user from '../user'
import moment from 'moment'
import { BudgetDb, BudgetType } from '../../types/budgetType'

const addBulkBudget = async (data: BudgetType[]): Promise<void> => {
  const batch = firestore().batch()
  const userDB = await user.getUser()

  data.forEach((item) => {
    const itemData: BudgetDb = { ...item, timestamp: moment().toDate() }

    const budgetRef = userDB.docs[0].ref.collection('budgets').doc()

    batch.set(budgetRef, itemData)
  })

  batch.commit()
}

const getBudgets = async (): Promise<
  FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
> => {
  return (await user.getUser()).docs[0].ref.collection('budgets')
}

export default { addBulkBudget, getBudgets }
