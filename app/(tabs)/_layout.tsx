import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {icon} from '@/constants/icons'
import { FontLoader } from '@/components/FontLoader'
const _layout = () => {


  return (
    <Tabs
    screenOptions={{
        headerShown:false,
        tabBarShowLabel: true,
        tabBarStyle : styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor:"#ffffff",
        tabBarInactiveTintColor:'#6564CD',
        tabBarItemStyle: {
              width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
        }
    }}
    >
      <Tabs.Screen name='index' options={{title:'Home' , headerShown: false, tabBarIcon:({focused}) => (
        <Image source={icon.home} style={[styles.imageStyle,
          { tintColor: focused ? "#ffffff" : "#6564CD" }]}/>
      )}}/>
      
      <Tabs.Screen name='practice' options={{title:'Practice' ,headerShown:false, tabBarIcon:({focused}) => (
        <Image source={icon.practice} style={[styles.imageStyle,
          { tintColor: focused ? "#ffffff" : "#6564CD"}]}/>
      )}}/>

      <Tabs.Screen name='dictionary' options={{title:'Dictionary' ,headerShown:false, tabBarIcon: ( {focused} ) => (
        <Image source={icon.dictionary} style={[styles.imageStyle,
          { tintColor: focused ? "#ffffff" : "#6564CD"}]}/>
      )}}/>

      <Tabs.Screen name='profile' options={{title:'Profile' ,headerShown:false, tabBarIcon : ({focused}) => (
        <Image source={icon.profile} style={[styles.imageStyle, 
          {tintColor: focused ? "#ffffff" : "#6564CD"}]}/>
      )}}/>
      
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({


    tabBar:{
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 36,
    height: 56,
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor:'#67E8F9',
    },

    tabBarLabel:{
     fontSize:12,
     fontWeight:'600',
     fontFamily:'IrishGrover-Regular', 
    },

    imageStyle: {
      width:24,
      height:20,

    }
})