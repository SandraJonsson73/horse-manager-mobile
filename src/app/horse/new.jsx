import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { horses } from '../../api/horses';
import HorseForm from '../../components/HorseForm';

export default function NewHorse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData, imageUri) => {
    setLoading(true);
    try {
      const created = await horses.create(formData);
      if (imageUri) {
        await horses.uploadImage(created.id, imageUri);
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HorseForm onSave={handleSave} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
