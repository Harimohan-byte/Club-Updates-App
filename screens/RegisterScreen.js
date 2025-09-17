// screens/RegisterScreen.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Save role in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        role,
      });

      navigation.replace("Dashboard", { role });
    } catch (err) {
      alert(err.message || "Registration failed.");
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
        Register to <Text style={{ fontWeight: "700" }}>Club Updates</Text> and
        get connected with{"\n"}all{" "}
        <Text style={{ fontWeight: "700" }}>events, news, and club activities</Text>{" "}
        at IIIT Naya Raipur.
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

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === "student" && styles.activeRole]}
          onPress={() => setRole("student")}
        >
          <Text style={styles.roleText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === "clubhead" && styles.activeRole]}
          onPress={() => setRole("clubhead")}
        >
          <Text style={styles.roleText}>Club Head</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 12 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#444" }}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      )}

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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: "#4DB0FF",
    borderRadius: 12,
    alignItems: "center",
  },
  activeRole: {
    backgroundColor: "#4DB0FF",
  },
  roleText: {
    color: "#333",
    fontWeight: "600",
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
