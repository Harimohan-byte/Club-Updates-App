// screens/DashboardScreen.js
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

export default function DashboardScreen({ route, navigation }) {
  const { role } = route.params;

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
      {/* IIIT NR Logo at Top */}
      <Image
        source={require("../assets/images/iiitnr_logo.png")}
        style={styles.topLogo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to Club Updates</Text>
      <Text style={styles.subtitle}>Logged in as: {role}</Text>

      {/* Features */}
      {role === "clubhead" ? (
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => navigation.navigate("CreateUpdate")}
        >
          <Text style={styles.featureText}>+ Create Update</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoText}>
          You’ll receive updates from your club heads here.
        </Text>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer with App Logo + Watermark */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4FBFF",
    justifyContent: "flex-start",
  },
  topLogo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  featureButton: {
    backgroundColor: "#4DB0FF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginVertical: 10,
  },
  featureText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  infoText: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 20,
    color: "#444",
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 12,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  watermark: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
});
