import React, { useEffect, useState } from 'react';
import { AjaxClient } from '../services/ajax';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import rnStorage from '../services/rnStorage';

function TestingScreen() {
	const isFocused = useIsFocused();
	const [state_vars, updateVars] = useState({ anarcica_time: 'TBA', lastAccess: '', now: ''+new Date() });

	useEffect(() => {
		//console.log('Use Effect is called => ' + isFocused);
		if (isFocused) {
			rnStorage.get('testing/time').then(prevTime=>{
				updateVars((prevState) => ({ ...prevState, lastAccess: prevTime || '0' }));
			});
			//
			const updatedLastAccess = ('' + new Date());
			rnStorage.save('testing/time', updatedLastAccess);
			updateAntarcticaTime();
		}
	}, [isFocused]);

	function updateAntarcticaTime() {
		let api = new AjaxClient({});
		api.on_api_success = (data) => {
			updateVars((prevState) => ({ ...prevState, anarcica_time: data.datetime }));
		};
		api.get_data('http://worldtimeapi.org/api/timezone/Antarctica/Palmer');
	}

	return (
		<View style={{ padding: 10, backgroundColor: 'white', height: ' 100%' }}>
			<Button onPress={updateAntarcticaTime} title='Update Antarctica Time' />
			<Text>
				Antarctica/Palmer: <Text style={styles.time}>{
					state_vars.anarcica_time != 'TBA' ? '' + new Date(state_vars.anarcica_time): 'TBA'
				}
			</Text>
			</Text>


			<Text>
				Previous access: <Text style={styles.time}>{state_vars.lastAccess}</Text>
			</Text>

			<Text>
				Current Access : <Text style={styles.time}>{state_vars.now}</Text>
			</Text>

			
		</View>
	);
}

const styles = StyleSheet.create({
	time: {
		fontSize: 20,
		fontWeight: '700',
	},
});
export default TestingScreen;
