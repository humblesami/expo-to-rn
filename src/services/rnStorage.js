import AsyncStorage from '@react-native-async-storage/async-storage';
let rnStorage = {
    save: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, ''+value);
        } catch (eor1) {
            console.log('Error in save item to local staorage', eor2);
        }
    },
    get: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return ''+value;
        } catch (eor2) {
            console.log('Error in get item from local staorage', eor2);
        }
    }
}
export default rnStorage;