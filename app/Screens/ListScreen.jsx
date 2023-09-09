import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

function ListingSreen() {
	let cols = 3;	
	let list_items = ['One', 'Two', 'Three', 'Four'];
	const screen_width = Dimensions.get('window').width;

	return (
		
		<View style={{ padding: 10, backgroundColor: 'white', height: ' 100%' }}>
			<GestureHandlerRootView style={{ padding: 5 }}>
				<FlatList
					data={list_items}
					contentContainerStyle={{ backgroundColor: '#eee' }}
					renderItem={({ item }) => (
						<View style={[{width: screen_width / cols - cols - 5}, styles.listButton ]}>
							<Text>{item}</Text>
						</View>
					)}
					numColumns={cols}
					keyExtractor={(item, index) => index}
				/>
			</GestureHandlerRootView>
		</View>
	);
}

const styles = StyleSheet.create({
    listButton:{
		padding:8,
		marginRight:3,
		marginBottom: 10,
		backgroundColor:'#ccc'
	},
});

export default ListingSreen;
