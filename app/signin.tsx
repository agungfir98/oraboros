import { StyleSheet, View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from '@react-native-google-signin/google-signin'
import { useSession } from '../utils/authctx'

const SignIn = () => {
  const { signIn } = useSession()

  const { loading, signInFn } = signIn

  GoogleSignin.configure({
    offlineAccess: false,
  })

  useEffect(() => {
    const anu = setInterval(async () => {
      const status = await GoogleSignin.isSignedIn()
      console.log(status)
    }, 60000)

    return () => {
      clearInterval(anu)
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <View style={styles.container}>
        <Text style={{ fontSize: 28, fontWeight: '600' }}>SignIn</Text>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          disabled={loading}
          onPress={signInFn}
        />
      </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
})
