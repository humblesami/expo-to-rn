import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


export default async function GetDeviceLocation(){
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted;
        } catch (err) {
            console.warn(err);
        }
    };    
            
    let granted = await requestLocationPermission();
    if(granted){
        return new Promise((res, rej) => {
            Geolocation.getCurrentPosition(res, rej);
        });
    }
    else{
        return 'Location Permissions Not Granted';
    }
}
