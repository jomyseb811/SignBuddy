import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const fetch = () => {
     const [data,setData] = useState([])
      const response = axios.get('https://www.spreadthesign.com/api/')
    setData(response.data)
  return (
    <View>
      <Text>fetch</Text>
    </View>
  )
}

export default fetch

const styles = StyleSheet.create({})