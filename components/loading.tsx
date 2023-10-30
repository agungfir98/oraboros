import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Loading = () => {
  const [rotateValue] = useState(new Animated.Value(0))

  Animated.loop(
    Animated.timing(rotateValue, {
      toValue: 360,
      duration: 1000,
      easing: Easing.bezier(0.57, 1.1, 0.64, 0.26),
      useNativeDriver: true,
    }),
  ).start()

  const interpolateRotating = rotateValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ rotate: interpolateRotating }],
        }}
      >
        <MaterialCommunityIcons name="loading" size={44} />
      </Animated.View>
      <Text>Loading...</Text>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
