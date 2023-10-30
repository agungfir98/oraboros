import { Text, View, Animated, Easing } from 'react-native'
import React, { useState } from 'react'

const NoNetInfoComponent = () => {
  const [value] = useState(new Animated.Value(-50))

  Animated.timing(value, {
    toValue: 0,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start()

  return (
    <Animated.View
      style={{
        backgroundColor: '#eb4242',
        padding: 5,
        paddingTop: 25,
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        zIndex: 999,
        top: 0,
        left: 0,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [-50, 0],
              outputRange: [-50, 0],
            }),
          },
        ],
      }}
    >
      <Text style={{ fontWeight: '600', fontSize: 16, color: 'white' }}>
        No internet connection!
      </Text>
    </Animated.View>
  )
}

export default NoNetInfoComponent
