import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';


function Section({ children, title }) {
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

function AboutSreen({ navigation }) {
	return (
		
		<View style={{ padding: 10, backgroundColor: 'white', height: ' 100%' }}>
			<Text>Section</Text>
			<Section title="Step One">
				Edit <Text style={styles.highlight}>App.jsx</Text> to change this
				screen and then come back to see your edits.
			</Section>
			<View style={{padding: 10}}>
				<Text>Image</Text>
				<Image
					source={require('../assets/images/download.jpeg')}
					style={{ width: 50, height: 50 }}
				/>
				<Text>Icon</Text>
				<Ionicons name="menu" size={30} color="#900" onPress={() => { navigation.navigate('MenuTab') }} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	highlight: {
		fontWeight: '700',
	},
});

export default AboutSreen;
