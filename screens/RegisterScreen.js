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
    Alert, // Added Alert for better user feedback
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Requires installing this package
import { auth, db } from "../firebaseconfig"; 

// List of all available clubs for registration
const CLUB_OPTIONS = [
    "Atharv", 
    "AI ML CLUB", 
    "E- CELL", 
    "Money Matters", 
    "Igniters", 
    "Capriccio", 
    "Club de Theatre", 
    "The Society of Coders",
];

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    // extra fields for club head
    const [name, setName] = useState("");
    const [post, setPost] = useState("");
    const [clubName, setClubName] = useState(CLUB_OPTIONS[0]); // Default to the first club
    // Removed clubDescription field as it's not strictly necessary for functionality

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Error", "Please enter email and password.");
            return;
        }

        if (role === "clubhead" && (!name.trim() || !post.trim() || !clubName.trim())) {
            Alert.alert("Error", "Please fill in all club head details.");
            return;
        }

        setLoading(true);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            // Save user profile in Firestore
            const userData = {
                email: email.trim().toLowerCase(),
                role,
                name: name.trim(), // Name is required for both roles now, though only displayed for clubhead on registration form
                createdAt: new Date().toISOString(),
            };

            // ADD CLUB NAME TO USER DATA IF THEY ARE A CLUB HEAD
            if (role === "clubhead") {
                userData.clubName = clubName;
                userData.post = post.trim();
            }

            await setDoc(doc(db, "users", uid), userData);

            // Pass both role and the clubName to the Dashboard
            navigation.replace("Dashboard", { role, clubName: clubName });
        } catch (err) {
            Alert.alert("Registration Failed", err.message || "Registration failed.");
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
                    <Text style={[styles.roleText, role === "student" && styles.activeRoleText]}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleButton, role === "clubhead" && styles.activeRole]}
                    onPress={() => setRole("clubhead")}
                >
                    <Text style={[styles.roleText, role === "clubhead" && styles.activeRoleText]}>Club Head</Text>
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
                    
                    {/* NEW: CLUB SELECTION DROPDOWN */}
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Select Your Club:</Text>
                        <Picker
                            selectedValue={clubName}
                            onValueChange={(itemValue) => setClubName(itemValue)}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {CLUB_OPTIONS.map((club) => (
                                <Picker.Item key={club} label={club} value={club} />
                            ))}
                        </Picker>
                    </View>
                </>
            )}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 12 }} color="#4DB0FF" />
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
        paddingVertical: 50, // Added padding for better mobile view
    },
    topLogo: {
        width: 100,
        height: 100,
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
        backgroundColor: "#E4D4F7",
        borderRadius: 12,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        marginHorizontal: 2,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#fff", // Default inactive background
    },
    activeRole: {
        backgroundColor: "#4DB0FF", // Active background color
    },
    roleText: {
        color: "#333",
        fontWeight: "600",
    },
    activeRoleText: {
        color: "#fff",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#E4D4F7",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginVertical: 8,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    pickerLabel: {
        fontSize: 12,
        color: "#555",
        paddingHorizontal: 8,
    },
    picker: {
        height: 40,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
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