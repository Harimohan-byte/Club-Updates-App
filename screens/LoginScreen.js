// screens/LoginScreen.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        navigation.replace("Dashboard", { role: userData.role });
      } else {
        alert("User data not found.");
      }
    } catch (err) {
      alert(err.message || "Login failed.");
    } finally {
      setLoading(false);
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

      {/* Intro */}
      <Text style={styles.intro}>
        <Text style={{ fontWeight: "700" }}>Club Updates</Text> keeps IIIT Naya Raipur
        students connected with{"\n"}latest{" "}
        <Text style={{ fontWeight: "700" }}>events, announcements, and club activities.</Text>
      </Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 12 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: "#444" }}>Don’t have an account? Register</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Footer with App Logo + Watermark */}
      <View style={styles.footer}>
        <Image
          source={require("../assets/images/logo.png")} // app logo
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
    backgroundColor: "#FFF6FB",
    justifyContent: "center",
  },
  topLogo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 15,
  },
  intro: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E4D4F7",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "#4DB0FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    marginTop: 14,
    alignItems: "center",
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
