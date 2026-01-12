
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


// export default function TabTwoScreen() {
// 	return (
// 		<ParallaxScrollView
// 			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
// 			headerImage={
// 				<IconSymbol
// 					size={310}
// 					color="#808080"
// 					name="chevron.left.forwardslash.chevron.right"
// 					style={styles.headerImage}
// 				/>
// 			}>
// 			{/* <ThemedView style={styles.titleContainer}>
// 				<ThemedText
// 					type="title"
// 					style={{
// 						fontFamily: Fonts.rounded,
// 					}}>
// 					Explore
// 				</ThemedText>
// 			</ThemedView> */}
// 			{/* <ThemedText>This app includes example code to help you get started.</ThemedText>
// 			<Collapsible title="File-based routing">
// 				<ThemedText>
// 					This app has two screens:{' '}
// 					<ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
// 					<ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
// 				</ThemedText>
// 				<ThemedText>
// 					The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
// 					sets up the tab navigator.
// 				</ThemedText>
// 				<ExternalLink href="https://docs.expo.dev/router/introduction">
// 					<ThemedText type="link">Learn more</ThemedText>
// 				</ExternalLink>
// 			</Collapsible>
// 			<Collapsible title="Android, iOS, and web support">
// 				<ThemedText>
// 					You can open this project on Android, iOS, and the web. To open the web version, press{' '}
// 					<ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
// 				</ThemedText>
// 			</Collapsible>
// 			<Collapsible title="Images">
// 				<ThemedText>
// 					For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
// 					<ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
// 					different screen densities
// 				</ThemedText>
// 				<Image
// 					source={require('@/assets/images/react-logo.png')}
// 					style={{ width: 100, height: 100, alignSelf: 'center' }}
// 				/>
// 				<ExternalLink href="https://reactnative.dev/docs/images">
// 					<ThemedText type="link">Learn more</ThemedText>
// 				</ExternalLink>
// 			</Collapsible>
// 			<Collapsible title="Light and dark mode components">
// 				<ThemedText>
// 					This template has light and dark mode support. The{' '}
// 					<ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
// 					what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
// 				</ThemedText>
// 				<ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
// 					<ThemedText type="link">Learn more</ThemedText>
// 				</ExternalLink>
// 			</Collapsible>
// 			<Collapsible title="Animations">
// 				<ThemedText>
// 					This template includes an example of an animated component. The{' '}
// 					<ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
// 					the powerful{' '}
// 					<ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
// 						react-native-reanimated
// 					</ThemedText>{' '}
// 					library to create a waving hand animation.
// 				</ThemedText>
// 				{Platform.select({
// 					ios: (
// 						<ThemedText>
// 							The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
// 							component provides a parallax effect for the header image.
// 						</ThemedText>
// 					),
// 				})}
// 			</Collapsible> */}
// 		</ParallaxScrollView>
// 	);
// }

export default function EditableTextGrid() {
  const { rowSizeStr, columnSizeStr } = useLocalSearchParams();
  const rowSize = parseInt(rowSizeStr as string, 10) || 5;
  const columnSize = parseInt(columnSizeStr as string, 10) || 5;

  const [modalVisible, setModalVisible] = useState(false);

  const [grid, setGrid] = useState<string[][]>();

  useEffect(() => {
      const newGrid = Array.from({ length: rowSize }, () =>
        Array.from({ length: columnSize }, () => '')
      );
      setGrid(newGrid);
    }, 
    [rowSize, columnSize]
  );

  if (!grid) {
    return (
      <View style={styles.container}>
        <Text>Loading grid...</Text>
      </View>
    );
  }

  const updateCell = (row: number, col: number, value: string) => {
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : r
    );
    setGrid(newGrid);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>
        <Text style={styles.title}>Editable Text Grid</Text>
        <Text>Grid Size: {grid.length} x {grid[0].length}</Text>
        {
        grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              // <TextInput
              //   key={`${rowIndex}-${colIndex}`}
              //   style={styles.cell}
              //   value={cell}
              //   onChangeText={(text: string) => updateCell(rowIndex, colIndex, text)}
              //   placeholderTextColor="#999"
              // />
              <Button
                key={`${rowIndex}-${colIndex}`}
                value={'click me'}
                onPress={() => {
                  updateCell(rowIndex, colIndex, 'Clicked');
                }}
                placeholderTextColor="#999"
              />
            ))}
          </View>
        ))}
        <Modal
          animationType="slide" // "slide", "fade", or "none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Popup Title</Text>
              <Text style={styles.modalText}>This is your popup content!</Text>
              
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gridContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 4,
    fontSize: 16,
    textAlign: 'center',
  },
	button: {
		marginVertical: 4,
		marginHorizontal: 2,
	},
    modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

// const styles = StyleSheet.create({
// 	headerImage: {
// 		color: '#808080',
// 		bottom: -90,
// 		left: -35,
// 		position: 'absolute',
// 	},
// 	titleContainer: {
// 		flexDirection: 'row',
// 		gap: 8,
// 	},
// });
