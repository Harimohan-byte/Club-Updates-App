// screens/UpdateDetails.js
import { ScrollView, StyleSheet, Text } from "react-native";

export default function UpdateDetails({ route }) {
  const { update } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{update.title}</Text>
      <Text style={styles.desc}>{update.description}</Text>
      <Text style={styles.meta}>Posted by: {update.clubHeadName} ({update.clubHeadPost})</Text>
      <Text style={styles.clubDesc}>{update.clubDescription}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  desc: { fontSize: 16, marginBottom: 10 },
  meta: { fontSize: 14, color: "gray", marginBottom: 10 },
  clubDesc: { fontSize: 15, fontStyle: "italic", color: "#444" },
});
