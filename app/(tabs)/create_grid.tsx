import { router } from 'expo-router';
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default function TextGridSizeAdjuster () {
	const [rowSize, setRowSize] = useState(5);
	const [columnSize, setColumnSize] = useState(5);

	return (
		<View 
			style={styles.container}
		>
			<Text style={styles.title}>Grid Size Adjuster</Text>
			<View 
				style={styles.gridSizeLabelContainer}
			>
					<Text style={styles.gridSizeLabel}>Rows:</Text>
					<Text style={styles.gridSizeValue}>{rowSize}</Text>
			</View>
			<View>
				<TouchableHighlight
					style={styles.button}
				>
					<Button
						title="+"
						onPress={() => {	
							setRowSize(rowSize + 1);
						}} 
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.button}
				>
					<Button 
						title="-" 
						onPress={() => {
							const adjustedRowSize = rowSize - 1;
							if (adjustedRowSize < 1) return;
							setRowSize(adjustedRowSize);
						}} 
					/>
				</TouchableHighlight>
			</View>
			<Text>Columns: {columnSize}</Text>
			<View>
				<TouchableHighlight
					style={styles.button}
				>
					<Button
						title="+" 
						onPress={() => {	
							setColumnSize(columnSize + 1);
						}} 
					/>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.button}
				>
					<Button 
						title="-" 
						onPress={() => {
							const adjustedColumnSize = columnSize - 1;
							if (adjustedColumnSize < 1) return;
							setColumnSize(adjustedColumnSize);
						}} 
					/>
				</TouchableHighlight>
			</View>
			<TouchableHighlight
				style={styles.createGridButton}
				onPress={() => {
					/** Create the grid and change tab to grid */
					router.push({
						pathname: '/grid',
						params: { 
							rowSizeStr: rowSize.toString(),
							columnSizeStr: columnSize.toString(),
						}
					});
					// Logic to create and display the grid based on rowSize and columnSize
				}}
			>
				<Text style={styles.createGridButtonText}>Create Grid</Text>
			</TouchableHighlight>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { 
		backgroundColor: 'white',
		padding: 20,
		height: '100%',
		justifyContent: 'flex-start',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	button: {
		marginVertical: 4,
		marginHorizontal: 2,
		height: 40,
	},
	gridSizeLabelContainer: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	gridSizeLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		marginRight: 8,
		fontWeight: 'bold',
	},
	gridSizeValue: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	createGridButton: {
		marginTop: 20,
		backgroundColor: 'black',
		borderRadius: 5,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white',
	},
	createGridButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});