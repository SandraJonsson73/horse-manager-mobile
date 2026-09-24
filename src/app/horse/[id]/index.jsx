import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ORIGIN, horses } from '../../../api/horses';

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function HorseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [horse, setHorse] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setFetching(true);
      setError('');
      horses.getById(id)
        .then((data) => { if (active) setHorse(data); })
        .catch((err) => { if (active) setError(err.message); })
        .finally(() => { if (active) setFetching(false); });
      return () => { active = false; };
    }, [id])
  );

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#764ba2" />
      </View>
    );
  }

  if (error || !horse) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Hästen kunde inte hittas'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {horse.imagePath ? (
        <Image source={{ uri: `${API_ORIGIN}${horse.imagePath}` }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Ingen bild</Text>
        </View>
      )}

      <Text style={styles.name}>{horse.name}</Text>
      <Text style={styles.status}>{horse.isCurrent ? 'Nuvarande häst' : 'Tidigare häst'}</Text>

      <View style={styles.infoBox}>
        <InfoRow label="Ras" value={horse.breed} />
        <InfoRow label="Födelseår" value={horse.birthYear} />
        {horse.breeder ? <InfoRow label="Uppfödare" value={horse.breeder} /> : null}
        <InfoRow label="Ägare" value={horse.owner} />
        {horse.trainer ? <InfoRow label="Tränare" value={horse.trainer} /> : null}
        {horse.notes ? <InfoRow label="Anteckningar" value={horse.notes} /> : null}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/horse/${id}/edit`)}>
        <Text style={styles.editButtonText}>Ändra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  error: { color: '#4b2e6f', fontSize: 16, textAlign: 'center' },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: 'contain',
    backgroundColor: '#f8f5fb',
  },
  placeholder: { backgroundColor: '#e0d6ec', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#764ba2' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  status: { fontSize: 14, color: '#764ba2', marginBottom: 16 },
  infoBox: { backgroundColor: '#f8f5fb', borderRadius: 10, padding: 14, marginBottom: 20 },
  row: { marginBottom: 10 },
  rowLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  rowValue: { fontSize: 16, color: '#333' },
  editButton: { backgroundColor: '#764ba2', padding: 14, borderRadius: 8, alignItems: 'center' },
  editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
