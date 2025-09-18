// screens/Dashboard.js
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase";

export default function DashboardScreen({ route, navigation }) {
  const { role } = route.params;
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* IIIT NR Logo */}
      <Image
        source={require("../assets/images/iiitnr_logo.png")}
        style={styles.topLogo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to Club Updates</Text>
      <Text style={styles.subtitle}>Logged in as: {role}</Text>

      {role === "clubhead" && (
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => navigation.navigate("CreateUpdate")}
        >
          <Text style={styles.featureText}>+ Create Update</Text>
        </TouchableOpacity>
      )}

      {/* List of updates */}
      <FlatList
        data={updates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("UpdateDetails", { update: item })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text numberOfLines={2}>{item.description}</Text>
            <Text style={styles.cardMeta}>By {item.clubHeadName || item.author}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 65, height: 65, marginBottom: 6 }}
          resizeMode="contain"
        />
        <Text style={styles.watermark}>IIIT NAYA RAIPUR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4FBFF" },
  topLogo: { width: 120, height: 120, alignSelf: "center", marginBottom: 20, marginTop: 10 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 10, color: "#222" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#555" },
  featureButton: { backgroundColor: "#4DB0FF", borderRadius: 12, padding: 14, alignItems: "center", marginVertical: 10 },
  featureText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginVertical: 6, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardMeta: { fontSize: 12, color: "#888" },
  logoutButton: { marginTop: 20, alignSelf: "center", padding: 12, backgroundColor: "#FF6B6B", borderRadius: 12 },
  logoutText: { color: "#fff", fontWeight: "700" },
  footer: { alignItems: "center", marginTop: 40 },
  watermark: { fontSize: 14, color: "#666", fontWeight: "600" },
});
