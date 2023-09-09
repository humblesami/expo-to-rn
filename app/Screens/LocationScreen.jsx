import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import GetDeviceLocation from '../services/GetDeviceLocation';


export default function LocationScreen(){
    let default_value = 0;
    const [current_location, updateLocation] = useState(default_value);
    const [other_key, setOtherKey] = useState(default_value);

    useEffect(() => {
        // useEffect being called at start
        GetDeviceLocation().then(function(res){
            if(res && typeof res != 'string'){
                updateLocation(res.coords);
            }
        });
        setOtherKey(2);
    }, []);

    return (
        <View style={{padding: 20}}>
            <Text>
                {
                    current_location ? 
                    'latitude: ' + current_location.latitude + ', longitude: ' + current_location.longitude
                    : 'NA'
                }
            </Text>
            <Text>Other: {other_key}</Text>
        </View>
    );    
}
