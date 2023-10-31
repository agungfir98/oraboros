import {
  GoogleSignin,
  User,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { ReactNode, createContext, useContext, useState } from 'react'
import AuthError from './authError'
import { router } from 'expo-router'
import db from '../db'
import { Alert } from 'react-native'

const AuthContext = createContext<{
  signIn: {
    loading: boolean
    setLoading: (arg: boolean) => void
    signInFn: () => void
  }
  signOut: () => void
  getCurrentUser: () => Promise<User | null>
} | null>(null)

export function useSession() {
  const value = useContext(AuthContext)

  if (!value)
    throw new Error('useSession must be wrapped in a <AuthProvider />')

  return value
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signInLoading, setSignInLoading] = useState(false)

  const signIn = {
    loading: signInLoading,
    setLoading: (arg: boolean) => setSignInLoading(arg),
    signInFn: async () => {
      setSignInLoading(true)
      await GoogleSignin.hasPlayServices()

      return GoogleSignin.signIn()
        .then((user) => {
          return db.user.getUser().then((snapshot) => {
            if (!snapshot.docs.length) {
              return db.user.createUser(user.user)
            }
          })
        })
        .then(() => {
          setSignInLoading(false)
          router.replace('/(tabs)')
          return
        })
        .catch((err) => {
          const error = err as AuthError
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            setSignInLoading(false)
          }
          setSignInLoading(false)
        })
    },
  }

  GoogleSignin.configure({
    offlineAccess: false,
  })

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut() {
          Alert.alert(
            'Sign Out',
            'You are about to signed out from the app, are you sure?',
            [
              {
                text: 'Sign me out',
                onPress() {
                  GoogleSignin.signOut().then((res) => {
                    router.replace('/signin')
                    return res
                  })
                },
                style: 'destructive',
              },
              {
                text: 'Cancel',
                onPress() {
                  return
                },
              },
            ],
          )
        },
        getCurrentUser: async (): Promise<User | null> => {
          return GoogleSignin.getCurrentUser()
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
