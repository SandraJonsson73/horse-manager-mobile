import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { horses } from '../../api/horses';
import HorseForm from '../../components/HorseForm';

export default function HorseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setFetching(true);
      horses.getById(id)
        .then((data) => { if (active) setHorse(data); })
        .catch(() => { if (active) Alert.alert('Fel', 'Kunde inte hämta hästen'); })
        .finally(() => { if (active) setFetching(false); });
      return () => { active = false; };
    }, [id])
  );

  const handleSave = async (formData, imageUri) => {
    setLoading(true);
    try {
      await horses.update(id, formData);
      if (imageUri) {
        await horses.uploadImage(id, imageUri);
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Radera häst',
      `Är du säker på att du vill radera ${horse?.name}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Radera',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await horses.delete(id);
              router.back();
            } catch {
              Alert.alert('Fel', 'Kunde inte radera hästen');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (fetching || !horse) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#764ba2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HorseForm
        editingHorse={horse}
        onSave={handleSave}
        onDelete={handleDelete}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
