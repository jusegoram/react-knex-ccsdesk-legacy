//CCS_UNIQUE QAJ2LUORJRB
// Common react native component - iOS + Android

// React
import React from 'react'

// React native UI
import { StyleSheet, Text, View } from 'react-native'

const Users = () => {
  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <Text style={styles.box}>Hello Users!</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  element: {
    paddingTop: 30,
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
})

export default Users
