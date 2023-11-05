import { StyleSheet, View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { useSession } from '../utils/authctx'
import { useConnectionContext } from '../utils/connectionProvider'

const SignIn = () => {
  const { signIn } = useSession()
  const { isConnected } = useConnectionContext()

  const { loading, setLoading, signInFn } = signIn

  useEffect(() => {
    if (!isConnected) setLoading(true)
    if (isConnected) setLoading(false)
  }, [isConnected])

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
