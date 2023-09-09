import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    bt1 :{
        marginTop: 5,
        marginBottom: 10
    }
});

export default function MenuScreen({navigation}){    
    return (
        <View style={{padding: 10}}>
            <View style={{padding: 10}}>
                <Button onPress={()=>{navigation.navigate('Location')}} title='See Locations' style={styles.bt1} />
            </View>
            <View style={{padding: 10}}>
                <Button onPress={()=>{navigation.navigate('AboutStack')}} title='Basic Elements Stack' style={styles.bt1} />
            </View>
            <View style={{padding: 10}}>
                <Button onPress={()=>{navigation.navigate('AboutTab')}} title='Basic Elements Tab' style={styles.bt1} />
            </View>
            <View style={{padding: 10}}>
                <Button onPress={()=>{navigation.navigate('ListStack')}} title='List' style={styles.bt1} />
            </View>
        </View>
    );
}
