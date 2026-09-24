import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ORIGIN, horses } from '../api/horses';

export default function Index() {
  const router = useRouter();
  const [horseList, setHorseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHorses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await horses.getAll();
      setHorseList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hämta hästarna varje gång skärmen visas (t.ex. efter att man lagt till/ändrat en häst)
  useFocusEffect(
    useCallback(() => {
      fetchHorses();
    }, [])
  );

  const currentHorses = horseList.filter((h) => h.isCurrent);
  const formerHorses = horseList.filter((h) => !h.isCurrent);

  const renderHorse = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/horse/${item.id}`)}
    >
      {item.imagePath ? (
        <Image source={{ uri: `${API_ORIGIN}${item.imagePath}` }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Ingen bild</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>{item.breed} · {item.birthYear}</Text>
        <Text style={styles.detail}>Ägare: {item.owner}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#764ba2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/horse/new')}>
        <Text style={styles.addButtonText}>+ Lägg till häst</Text>
      </TouchableOpacity>

      <FlatList
        data={[
          { type: 'header', title: `Nuvarande hästar (${currentHorses.length})` },
          ...currentHorses.map((h) => ({ type: 'horse', ...h })),
          { type: 'header', title: `Tidigare hästar (${formerHorses.length})` },
          ...formerHorses.map((h) => ({ type: 'horse', ...h })),
        ]}
        keyExtractor={(item, index) => (item.type === 'header' ? `header-${index}` : `horse-${item.id}`)}
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <Text style={styles.sectionHeader}>{item.title}</Text>
          ) : (
            renderHorse({ item })
          )
        }
        ListEmptyComponent={<Text style={styles.empty}>Ingen häst registrerad ännu.</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  addButton: {
    backgroundColor: '#764ba2',
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#764ba2', marginTop: 20, marginBottom: 8 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f5fb',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: { width: 90, height: 90 },
  placeholder: { backgroundColor: '#e0d6ec', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#764ba2' },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  detail: { fontSize: 13, color: '#555' },
  error: {
    backgroundColor: '#f3e9fa',
    borderColor: '#4b2e6f',
    borderWidth: 1,
    color: '#4b2e6f',
    padding: 10,
    margin: 16,
    marginBottom: 0,
    borderRadius: 6,
  },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});
