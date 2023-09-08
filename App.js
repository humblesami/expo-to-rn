import React from 'react';
import { Image, StyleSheet, Text, useColorScheme, View, } from 'react-native';
import * as Notifications from 'expo-notifications';
import Ionicons from '@expo/vector-icons/Ionicons';


function Section({ children, title }) {
	const isDarkMode = useColorScheme() === 'dark';
	return (
		<View style={styles.sectionContainer}>
			<Text>
				{title}
			</Text>
			<Text>
				{children}
			</Text>
		</View>
	);
}

function AboutSreen() {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<View>
			<View>
        <Ionicons name='md-checkmark-circle' size={32} color='green' />
				{/* <ExpoPush /> */}
				<Section title="Step One">
					Edit <Text style={styles.highlight}>App.jsx</Text> to change this
					screen and then come back to see your edits.
				</Section>
			</View>
		</View>		
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
});

export default AboutSreen;