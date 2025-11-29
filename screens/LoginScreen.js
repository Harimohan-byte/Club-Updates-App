import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert, 
    Animated,
    Dimensions, 
} from "react-native";
import { auth, db } from "../firebaseconfig";

// --- CLUB IMAGE MAPPING (Replicated here for background visuals) ---
const CLUB_IMAGE_MAP = {
    "Atharv": require('../assets/images/ATHARV.png'),
    "AI ML CLUB": require('../assets/images/AIML.png'),
    "E- CELL": require('../assets/images/ECELL.png'),
    "Money Matters": require('../assets/images/MONEYMATTERS.png'),
    "Igniters": require('../assets/images/IGNITERS.png'),
    "Capriccio": require('../assets/images/CAPRICIO.png'),
    "Club de Theatre": require('../assets/images/CLUBDETHEATRE.png'),
    "The Society of Coders": require('../assets/images/TSOC.png'),
    // Fallback image source path if no match is found:
    "DEFAULT": require('../assets/images/DEFAULT.png'), 
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// --- FLOATING BACKGROUND COMPONENT ---
const FloatingBackground = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const items = Object.values(CLUB_IMAGE_MAP);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 25000,
                useNativeDriver: true,
            })
        ).start();
    }, [animation]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -SCREEN_HEIGHT / 2],
    });

    return (
        <Animated.View style={[styles.backgroundWrapper, { transform: [{ translateY }] }]}>
            <View style={styles.floatingContainer}>
                {items.map((source, index) => (
                    <Image
                        key={index}
                        source={source}
                        style={styles.floatingImage}
                        resizeMode="cover"
                        // INCREASED OPACITY: Raised from 0.3 to 0.45 for brighter look
                        opacity={0.45 + (index * 0.01)} 
                    />
                ))}
            </View>
        </Animated.View>
    );
};
// --- END FLOATING BACKGROUND COMPONENT ---


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            const docSnap = await getDoc(doc(db, "users", uid));
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                const clubName = userData.role === "clubhead" ? userData.clubName : null;

                navigation.replace("Dashboard", { 
                    role: userData.role,
                    clubName: clubName
                });
            } else {
                Alert.alert("Login Failed", "User data not found in database. Please register.");
            }
        } catch (err) {
            Alert.alert("Login Failed", err.message || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainWrapper}>
            
            {/* 1. ANIMATED BACKGROUND (Covers full screen behind content) */}
            <FloatingBackground />
            
            {/* 2. OVERLAY AND MAIN CONTENT (The Login Form Area) */}
            <View style={styles.contentWrapper}>
                <View style={styles.container}>
                    
                    <Text style={styles.loginHeading}>CLUB LOGIN</Text>
                    
                    {/* IIIT NR Logo at Top */}
                    <Image
                        source={require("../assets/images/iiitnr_logo.png")}
                        style={styles.topLogo}
                        resizeMode="contain"
                    />

                    {/* Intro (Text color is white for contrast) */}
                    <Text style={styles.intro}>
                        <Text style={styles.introTextBold}>Club Updates</Text> keeps IIIT Naya Raipur
                        students connected with{"\n"}latest{" "}
                        <Text style={styles.introTextBold}>events, announcements, and club activities.</Text>
                    </Text>

                    {/* Inputs */}
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#aaa" 
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    {loading ? (
                        <ActivityIndicator size="large" style={{ marginTop: 12 }} color="#4DB0FF" />
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.link}
                                onPress={() => navigation.navigate("Register")}
                            >
                                <Text style={styles.linkText}>Don’t have an account? Register</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Footer with App Logo + Watermark */}
                    <View style={styles.footer}>
                        <Image
                            source={require("../assets/images/logo.png")} // app logo
                            style={styles.appLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.watermark}>IIIT NAYA RAIPUR</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: "#0F1A2C", // Dark, rich background color
    },
    backgroundWrapper: {
        ...StyleSheet.absoluteFillObject,
    },
    contentWrapper: {
        // This ensures the content is centered and covers the whole screen
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // Container holds the foreground content (the login form area)
    container: {
        width: '90%', 
        maxWidth: 400,
        padding: 25,
        backgroundColor: 'transparent', // Background is transparent
    },
    loginHeading: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white', // White text for contrast
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Added text shadow for legibility over colors
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    topLogo: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: 15,
        // Logo is placed on a white circle for contrast
        backgroundColor: 'white', 
        borderRadius: 50,
    },
    intro: {
        fontSize: 16,
        color: "white", 
        marginBottom: 20,
        textAlign: "center",
        lineHeight: 22,
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    introTextBold: {
        fontWeight: "700",
        color: '#FFD700', // Gold color for bold text
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E4D4F7",
        // Input fields are semi-opaque white for easy typing, but allow background to show
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: 12,
        paddingHorizontal: 12,
        marginVertical: 8,
        color: '#333',
    },
    button: {
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        backgroundColor: "#4DB0FF",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4, 
        shadowRadius: 4,
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
    linkText: {
        color: "white", 
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    footer: {
        alignItems: "center",
        marginTop: 40,
    },
    appLogo: {
        width: 65, 
        height: 65, 
        marginBottom: 6,
    },
    watermark: {
        fontSize: 14,
        color: "white", 
        fontWeight: "600",
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    // --- FLOATING BACKGROUND STYLES ---
    floatingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: SCREEN_WIDTH * 1.8, // Made container slightly larger
        height: SCREEN_HEIGHT * 1.8, // Made container slightly larger
        opacity: 0.35, // Overall opacity
        transform: [{ rotate: '15deg' }], 
    },
    floatingImage: {
        width: SCREEN_WIDTH / 2.5, // Increased size for individual images
        height: SCREEN_HEIGHT / 3.5, // Increased size for individual images
        margin: 5,
        borderRadius: 8,
    }
});