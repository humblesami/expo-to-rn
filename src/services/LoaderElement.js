import React, {useState} from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';


const styles = StyleSheet.create({
    loader_style : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 20,
        bottom: 0,
        zIndex: 3,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
    
export default function LoaderElement({activities}) {    
    if(!activities.length)
    {
        return (<></>);
    }
    let last_activity = activities[activities.length-1];
    //console.log(7776666, activities.length, last_activity);
    return(
        <Modal transparent visible={activities.length > 0} onRequestClose={() => null}>
            <View style={{flex:1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center'}}>
                <ActivityIndicator style={styles.loader_style} color="green" size="large" />
                <Text style={{fontSize: 20, color: 'orange', marginTop: 100}}>Loading..</Text>
                <Text style={{fontSize: 20, color: 'orange',}}>{last_activity}</Text>
            </View>
        </Modal>
    );
}