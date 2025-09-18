// screens/RegisterScreen.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase"; // ✅ use your "firebase.js"

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // extra fields for club head
  const [name, setName] = useState("");
  const [post, setPost] = useState("");
  const [clubDescription, setClubDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (role === "clubhead" && (!name.trim() || !post.trim() || !clubDescription.trim())) {
      alert("Please fill in all club head details.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // save user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        email: email.trim().toLowerCase(),
        role,
        ...(role === "clubhead" && {
          name,
          post,
          clubDescription,
        }),
        createdAt: new Date().toISOString(),
      });

      navigation.replace("Dashboard", { role });
    } catch (err) {
      alert(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* IIIT NR Logo */}
      <Image
        source={require("../assets/images/iiitnr_logo.png")}
        style={styles.topLogo}
        resizeMode="contain"
      />

      <Text style={styles.intro}>
        Register to <Text style={{ fontWeight: "700" }}>Club Updates</Text> and get
        connected with{"\n"}all{" "}
        <Text style={{ fontWeight: "700" }}>events, news, and club activities</Text>{" "}
        at IIIT Naya Raipur.
      </Text>

      {/* Email + Password */}
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

      {/* Extra fields for club head */}
      {role === "clubhead" && (
        <>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Head Position (e.g. President)"
            value={post}
            onChangeText={setPost}
            style={styles.input}
          />
          <TextInput
            placeholder="Club Description"
            value={clubDescription}
            onChangeText={setClubDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />
        </>
      )}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 12 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      {/* Already have account? */}
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Login")}>
        <Text style={{ color: "#444" }}>Already have an account? Login</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
