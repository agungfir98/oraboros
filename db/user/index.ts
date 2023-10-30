import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'

const getUser = async (): Promise<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
> => {
  const user: User | null = await GoogleSignin.getCurrentUser().then(
    (res) => res,
  )

  return await firestore()
    .collection('Users')
    .where('id', '==', user?.user.id)
    .get()
}

const createUser = async (
  userInfo: User['user'],
): Promise<
  FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
> => {
  return firestore().collection('Users').add(userInfo)
}

export default { getUser, createUser }
