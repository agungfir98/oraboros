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
  signIn: { loading: boolean; signInFn: () => void }
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
    signInFn: async () => {
      setSignInLoading(true)
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()

        const getUser = await db.user.getUser()

        if (!getUser.docs.length) {
          await db.user.createUser(userInfo.user)
        }
        setSignInLoading(false)
        router.replace('/(tabs)')
        return userInfo
      } catch (error) {
        console.error(error)
        const err = error as AuthError
        if (err.code === statusCodes.SIGN_IN_CANCELLED) {
          setSignInLoading(false)
        }
      }
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
                onPress(value) {
                  GoogleSignin.signOut().then((res) => {
                    console.log('auth provider context signout', res)
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
