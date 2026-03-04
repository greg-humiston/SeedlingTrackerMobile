import { SEEDLINGS } from "@/data/home";
import { styles } from "@/styles/create-grid";
import { Seedling } from "@/types/home";
import { useState } from "react";
import {
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { ThemedText } from "./themed-text";

export function SeedlingSelector({
	onSelect,
}: {
	onSelect: (s: Seedling) => void;
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');

	const filtered = query.trim()
		? SEEDLINGS.filter((s) => {
			return s.variety?.toLowerCase().includes(query.toLowerCase());
		})
		: SEEDLINGS;

	const handleChangeText = (text: string) => {
		setQuery(text);
		if (text.length > 0) setOpen(true);
	};

	const handleClear = () => setQuery('');

	return (
		<View style={styles.inputGroup}>
			<ThemedText style={styles.inputLabel}>Seedling</ThemedText>
			<View style={styles.dropdownTrigger}>
				<TextInput
					style={styles.dropdownSearchInput}
					value={query}
					onChangeText={handleChangeText}
					placeholder={'Search seeds to choose…'}
					placeholderTextColor={'#aaa'}
				/>
				{query.length > 0 && (
					<TouchableOpacity onPress={handleClear} style={styles.dropdownClearBtn} activeOpacity={0.7}>
						<ThemedText style={styles.dropdownClearBtnText}>✕</ThemedText>
					</TouchableOpacity>
				)}
				<TouchableOpacity onPress={() => setOpen((o) => !o)} activeOpacity={0.7}>
					<ThemedText style={styles.dropdownChevron}>{open ? '▲' : '▼'}</ThemedText>
				</TouchableOpacity>
			</View>
			{open && (
				<View style={styles.dropdownList}>
					{filtered.length === 0 ? (
						<View style={styles.dropdownItem}>
							<ThemedText style={styles.dropdownPlaceholder}>{'No results for "' + query + '"'}</ThemedText>
						</View>
					) : (
						filtered.map((s) => (
							<TouchableOpacity
								key={s.variety}
								style={[styles.dropdownItem]}
								onPress={() => { 
									setOpen(false); 
									setQuery(''); 
									onSelect(s); 
								}}
								activeOpacity={0.75}
							>
								<ThemedText style={styles.dropdownItemEmoji}>{s.emoji}</ThemedText>
								<View style={styles.dropdownItemText}>
									<ThemedText style={styles.dropdownItemName}>{s.variety}</ThemedText>
								</View>
							</TouchableOpacity>
						))
					)}
				</View>
			)}
		</View>
	);
};

export default SeedlingSelector;