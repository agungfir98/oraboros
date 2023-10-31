import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import { GoogleSignin, User } from '@react-native-google-signin/google-signin'

const getUser = async (): Promise<
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
> => {
  return GoogleSignin.getCurrentUser().then((user) => {
    console.log('userrrrrrr ')
    if (user !== null) {
      return firestore()
        .collection('Users')
        .where('id', '==', user.user.id)
        .get()
    }
  }) as Promise<
    FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
  >
}

const createUser = async (
  userInfo: User['user'],
): Promise<
  FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
> => {
  return firestore().collection('Users').add(userInfo)
}

export default { getUser, createUser }
