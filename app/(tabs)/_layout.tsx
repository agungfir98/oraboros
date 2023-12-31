import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs, router } from 'expo-router'
import { Text, Image, Pressable, View } from 'react-native'

import Colors from '../../constants/Colors'
import { useSession } from '../../utils/authctx'
import { useEffect, useState } from 'react'
import { User } from '@react-native-google-signin/google-signin'
import Loading from '../../components/loading'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />
}

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)

  const { getCurrentUser } = useSession()

  useEffect(() => {
    setLoading(true)
    getCurrentUser().then((userInfo) => {
      if (!userInfo) {
        setUser(null)
        setLoading(false)
        router.replace('/signin')
        return
      }
      setUser(userInfo)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.tint,
          tabBarHideOnKeyboard: true,
          tabBarActiveBackgroundColor: Colors.inactive,
          tabBarInactiveTintColor: Colors.mute,
          tabBarItemStyle: {
            borderRadius: 20,
          },
          tabBarStyle: {
            position: 'absolute',
            height: 50,
            width: '70%',
            left: '15%',
            marginBottom: 15,
            borderRadius: 20,
            elevation: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="newTransaction"
          options={{
            headerTitle: 'New Transaction',
            headerTitleStyle: {
              color: 'white',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            headerLeft: (props) => (
              <Pressable
                onPress={router.back}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <FontAwesome
                  name="angle-left"
                  size={30}
                  color={'white'}
                  style={{ paddingLeft: 20 }}
                />
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 16 }}
                >
                  Back
                </Text>
              </Pressable>
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: Colors.background,
              borderBottomStartRadius: 20,
              borderBottomEndRadius: 20,
            },
            tabBarShowLabel: false,
            tabBarItemStyle: {
              position: 'fixed',
              top: -35,
              alignItems: 'center',
              minHeight: 70,
              maxWidth: 70,
              backgroundColor: 'white',
              borderRadius: 50,
              elevation: 5,
            },
            tabBarIcon: ({ color }) => (
              <FontAwesome
                size={30}
                style={{ marginBottom: -3 }}
                name="plus-square-o"
                color={color}
              />
            ),
            tabBarActiveTintColor: 'black',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) =>
              user?.user.photo ? (
                <Image
                  source={{ uri: user.user.photo }}
                  width={35}
                  height={35}
                  style={{ borderRadius: 50 }}
                />
              ) : (
                <TabBarIcon name="user" color={color} />
              ),
            tabBarActiveTintColor: 'red',
          }}
        />
      </Tabs>
    </View>
  )
}
