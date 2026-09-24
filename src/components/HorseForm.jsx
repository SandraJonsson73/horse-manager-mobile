import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_ORIGIN } from '../api/horses';

export default function HorseForm({ editingHorse, onSave, onDelete, loading }) {
const [formData, setFormData] = useState({
  name: '', breed: '', birthYear: new Date().getFullYear(),
  breeder: '', owner: '', trainer: '', notes: '', isCurrent: true,
});
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (editingHorse) {
      setFormData({
        name: editingHorse.name,
        breed: editingHorse.breed,
        birthYear: editingHorse.birthYear,
        breeder: editingHorse.breeder || '',
        owner: editingHorse.owner,
        trainer: editingHorse.trainer || '',
        notes: editingHorse.notes || '',
        isCurrent: editingHorse.isCurrent,
      });
    }
  }, [editingHorse]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Du måste ge appen tillgång till bilder för att kunna välja en profilbild.');
      return;
    }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError('');
    const missingFields = [];
    if (!formData.name) missingFields.push('Namn');
    if (!formData.breed) missingFields.push('Ras');
    if (!formData.owner) missingFields.push('Ägare');

    if (missingFields.length > 0) {
      setError(`Fyll i följande fält: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await onSave(formData, imageUri);
    } catch (err) {
      setError(err.message);
    }
  };

  const existingImage = editingHorse?.imagePath ? `${API_ORIGIN}${editingHorse.imagePath}` : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Namn *</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(v) => handleChange('name', v)}
        placeholder="T.ex. Stjärnan"
      />

      <Text style={styles.label}>Ras *</Text>
      <TextInput
        style={styles.input}
        value={formData.breed}
        onChangeText={(v) => handleChange('breed', v)}
        placeholder="T.ex. Svenskt kallblod"
      />

      <Text style={styles.label}>Födelseår *</Text>
      <TextInput
        style={styles.input}
        value={String(formData.birthYear)}
        onChangeText={(v) => handleChange('birthYear', parseInt(v, 10) || 0)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Uppfödare (valfritt)</Text>
      <TextInput
        style={styles.input}
        value={formData.breeder}
        onChangeText={(v) => handleChange('breeder', v)}
        placeholder="T.ex. Erik Larsson"
      />

      <Text style={styles.label}>Ägare *</Text>
      <TextInput
        style={styles.input}
        value={formData.owner}
        onChangeText={(v) => handleChange('owner', v)}
        placeholder="T.ex. Anna Svensson"
      />

      <Text style={styles.label}>Tränare (valfritt)</Text>
      <TextInput
        style={styles.input}
        value={formData.trainer}
        onChangeText={(v) => handleChange('trainer', v)}
        placeholder="T.ex. Maria Lindqvist"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Hästen är fortfarande i stallet</Text>
        <Switch
          value={formData.isCurrent}
          onValueChange={(v) => handleChange('isCurrent', v)}
          trackColor={{ true: '#764ba2' }}
        />
      </View>

      <Text style={styles.label}>Anteckningar (valfritt)</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={formData.notes}
        onChangeText={(v) => handleChange('notes', v)}
        placeholder="T.ex. Gillar morötter, väldigt snäll..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Profilbild</Text>
      {(imageUri || existingImage) && (
        <Image source={{ uri: imageUri || existingImage }} style={styles.preview} />
      )}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Välj bild</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {editingHorse ? 'Uppdatera' : 'Lägg till'}
          </Text>
        )}
      </TouchableOpacity>

      {editingHorse && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} disabled={loading}>
          <Text style={styles.deleteButtonText}>Radera</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 10, fontSize: 15,
  },
  textarea: { height: 90, textAlignVertical: 'top' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12,
  },
  preview: { width: 120, height: 120, borderRadius: 8, marginTop: 8, marginBottom: 8 },
  imageButton: {
    backgroundColor: '#e0d6ec', padding: 12, borderRadius: 6,
    alignItems: 'center', marginTop: 4,
  },
  imageButtonText: { color: '#764ba2', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#764ba2', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 24,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  deleteButton: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#c0392b',
    padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12, marginBottom: 30,
  },
  deleteButtonText: { color: '#c0392b', fontWeight: 'bold', fontSize: 16 },
  error: {
    backgroundColor: '#f3e9fa', borderColor: '#4b2e6f', borderWidth: 1,
    color: '#4b2e6f', padding: 10, borderRadius: 6, marginBottom: 12,
  },
});
