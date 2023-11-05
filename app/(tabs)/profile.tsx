import { StyleSheet, View, Text, Image, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSession } from '../../utils/authctx'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '../../constants/Colors'
import { User } from '@react-native-google-signin/google-signin'

type SettingMenuType = {
  title: string
  iconName: React.ComponentProps<typeof FontAwesome>['name']
  link: string
}

function SettingsIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />
}

const SettingsMenu: SettingMenuType[] = [
  {
    title: 'Budgetin',
    iconName: 'angle-right',
    link: '/tabs',
  },
]

export default function TabOneScreen() {
  const { signOut, getCurrentUser } = useSession()
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user)
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView />
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Image
            style={{ borderRadius: 50 }}
            width={40}
            height={40}
            source={{
              uri: user?.user.photo
                ? user.user.photo
                : 'https://lh3.googleusercontent.com/a/ACg8ocKb8b5rYNOwyTl2fTWk187Le5QmUH8RLcQJc4DnIlZgNw',
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: '700', color: 'white' }}>
            {user ? user.user.name : ''}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{ gap: 10 }}>
          {SettingsMenu.map((v, i) => {
            return (
              <Pressable key={i}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>
                    {v.title}
                  </Text>
                  <SettingsIcon name={v.iconName} />
                </View>
                <View
                  style={[
                    { borderWidth: 1, borderColor: Colors.mute, marginTop: 5 },
                  ]}
                />
              </Pressable>
            )
          })}
        </View>
        <Pressable
          onPress={signOut}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            elevation: 5,
          }}
        >
          <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#eb4034',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    gap: 10,
  },
  body: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
})
