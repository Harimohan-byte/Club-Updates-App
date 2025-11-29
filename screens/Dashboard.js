import { collection, onSnapshot, orderBy, query, limit, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Animated, Dimensions, ImageBackground, ScrollView } from "react-native";
import { auth, db } from "../firebaseconfig";

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- CLUB IMAGE MAPPING ---
const CLUB_IMAGE_MAP = {
    "Atharv": require('../assets/images/ATHARV.png'),
    "AI ML CLUB": require('../assets/images/AIML.png'),
    "E- CELL": require('../assets/images/ECELL.png'),
    "Money Matters": require('../assets/images/MONEYMATTERS.png'),
    "Igniters": require('../assets/images/IGNITERS.png'),
    "Capriccio": require('../assets/images/CAPRICIO.png'),
    "Club de Theatre": require('../assets/images/CLUBDETHEATRE.png'),
    "The Society of Coders": require('../assets/images/TSOC.png'),
    "DEFAULT": require('../assets/images/DEFAULT.png'), 
};

// --- HELPER FUNCTION: RANDOM IDEA SELECTION ---
const selectRandomIdeas = (allIdeas) => {
    if (!allIdeas || allIdeas.length === 0) return [];
    
    for (let i = allIdeas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIdeas[i], allIdeas[j]] = [allIdeas[j], allIdeas[i]];
    }
    return allIdeas.slice(0, 3);
};
// --- END HELPER FUNCTION ---

// --- FLOATING BACKGROUND COMPONENT (Horizontal Animation) ---
const FloatingBackground = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const items = Object.values(CLUB_IMAGE_MAP);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 40000, 
                useNativeDriver: true,
            })
        ).start();
    }, [animation]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -SCREEN_WIDTH * 1.5], 
    });

    return (
        <View style={styles.backgroundWrapper}>
            <Animated.View style={[styles.floatingContainer, { transform: [{ translateX }] }]}>
                {items.map((source, index) => (
                    <Image
                        key={index}
                        source={source}
                        style={styles.floatingImage}
                        resizeMode="cover"
                        opacity={0.6 + (index * 0.05)} 
                    />
                ))}
            </Animated.View>
        </View>
    );
};

// --- NEARBY EVENTS CARD COMPONENT (FIXED VIRTUALIZED LIST ERROR) ---
const NearbyEventsCard = ({ updates, navigation }) => {
    const today = new Date();
    // Using a future time range for filtering
    const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); 

    // Filter updates for events happening within the next 7 days
    const nearbyEvents = updates.filter(update => {
        if (update.eventDate && update.eventDate !== "TBA") {
            const eventDateTime = new Date(`${update.eventDate} ${update.eventTime}`);
            // Check if event is in the future and within the next week
            return eventDateTime >= today && eventDateTime <= oneWeekLater;
        }
        return false;
    });

    if (nearbyEvents.length === 0) return null;

    // FIX: Swapped inner FlatList for horizontal ScrollView to fix nesting error
    return (
        <View style={styles.nearbyEventsBlock}>
            <Text style={styles.nearbyHeader}>🗓️ Upcoming Events (Next 7 Days)</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.nearbyEventsScrollView}
            >
                {nearbyEvents.map((item) => {
                    const clubImageSource = CLUB_IMAGE_MAP[item.clubName] || CLUB_IMAGE_MAP.DEFAULT;
                    const dateDisplay = item.eventDate.split(',')[0] || 'TBA';
                    
                    return (
                        <ImageBackground
                            source={clubImageSource}
                            style={styles.nearbyCardBackground}
                            imageStyle={styles.cardImageStyle}
                            key={item.id}
                        >
                            <TouchableOpacity
                                style={styles.nearbyCardOverlay}
                                onPress={() => navigation.navigate("UpdateDetails", { update: item })}
                            >
                                <Text style={styles.nearbyCardClubName}>{item.clubName}</Text>
                                <Text style={styles.nearbyCardTitle}>{item.title}</Text>
                                <Text style={styles.nearbyCardDate}>{dateDisplay} @ {item.eventTime || 'Time TBA'}</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    );
                })}
            </ScrollView>
        </View>
    );
};
// --- END NEARBY EVENTS CARD COMPONENT ---


export default function DashboardScreen({ route, navigation }) {
    const { role, clubName: initialClubName } = route.params;
    
    const [updates, setUpdates] = useState([]);
    const [reminderMessage, setReminderMessage] = useState(null); 
    
    const [clubName, setClubName] = useState(initialClubName || null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    
    const [aiIdeas, setAiIdeas] = useState(null);
    const [aiLoading, setAiLoading] = useState(false); 

    const user = auth.currentUser;
    const uid = user ? auth.currentUser.uid : null;


    useEffect(() => {
        if (!uid) {
            setIsDataLoading(false);
            return;
        }

        const fetchUserData = async () => {
            if (role === "clubhead" && !initialClubName) {
                try {
                    const userRef = doc(db, "users", uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists() && userSnap.data().clubName) {
                        setClubName(userSnap.data().clubName);
                    } else {
                        Alert.alert("Setup Error", "Club data missing. Please register correctly.");
                    }
                } catch (error) {
                    console.error("Error fetching user club data:", error);
                }
            }
            setIsDataLoading(false);
        };

        // 1. Listener for all club updates
        const qUpdates = query(collection(db, "updates"), orderBy("createdAt", "desc"));
        const unsubscribeUpdates = onSnapshot(qUpdates, (snapshot) => {
            setUpdates(snapshot.docs.map((doc) => ({ 
                id: doc.id, 
                clubName: doc.data().clubName,
                ...doc.data() 
            })));
        });

        // 2. Listener for Club Head Reminders (Mock Reminder Alert)
        let unsubscribeReminders = () => {};
        if (role === "clubhead") {
            const reminderRef = collection(db, 'alerts', uid, 'reminders');
            const qReminders = query(reminderRef, orderBy("createdAt", "desc"), limit(1)); 
            unsubscribeReminders = onSnapshot(qReminders, (snapshot) => {
                if (!snapshot.empty) {
                    setReminderMessage(snapshot.docs[0].data().message);
                } else {
                    setReminderMessage(null);
                }
            }, (error) => {
                console.error("Error listening to reminders:", error);
            });
        }
        
        fetchUserData();
        
        return () => {
            unsubscribeUpdates();
            if (unsubscribeReminders) {
                unsubscribeReminders();
            }
        };
    }, [role, uid, initialClubName]); 

    // --- CONSOLIDATED AI FUNCTION: Fetches data from Firestore ---
    const getClubIdeas = async () => {
        if (!clubName) {
            Alert.alert("Setup Error", "Club name not assigned to user profile.");
            return;
        }

        setAiLoading(true);
        setAiIdeas(null); 
        
        try {
            // --- NEW: Simulate 3-second processing delay ---
            await new Promise(resolve => setTimeout(resolve, 3000)); 
            // --- END NEW DELAY ---

            const clubRef = doc(db, 'club_ideas', clubName);
            const clubSnap = await getDoc(clubRef);

            if (clubSnap.exists()) {
                const clubData = clubSnap.data();
                const allIdeas = clubData.ideas; 
                
                const selectedIdeas = selectRandomIdeas(allIdeas);

                setAiIdeas(selectedIdeas);
            } else {
                Alert.alert("Data Error", `No ideas found for club: ${clubName}. Ensure the database was seeded.`);
            }

        } catch (error) {
            console.error("Firestore Read Failed:", error);
            Alert.alert("Error", "Could not fetch club ideas from the database.");
        } finally {
            setAiLoading(false);
        }
    };
    // --- END CONSOLIDATED AI FUNCTION ---


    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.replace("Login");
        } catch (err) {
            Alert.alert("Logout failed", err.message || "Logout failed.");
        }
    };
    
    // Show loading indicator while fetching user's club name
    if (isDataLoading) {
        return (
            <View style={[styles.mainView, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4DB0FF" />
                <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
            </View>
        );
    }
    
    // The content that should always be visible (everything above the list)
    const headerContent = (
        <View style={{ paddingHorizontal: 20 }}>
            {/* Display NEARBY EVENTS CARD at the very top of the list content */}
            {/* IMPORTANT: This component is visible for all roles, including students */}
            {role === "student" && <NearbyEventsCard updates={updates} navigation={navigation} />} 

            {/* IIIT NR Logo */}
            <Image
                source={require("../assets/images/iiitnr_logo.png")}
                style={styles.topLogo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Welcome to Club Updates</Text>
            <Text style={styles.subtitle}>Logged in as: {role}{role === "clubhead" && clubName && ` (${clubName})`}</Text>

            {/* 3. NEW: Display the Reminder Alert prominently */}
            {role === "clubhead" && reminderMessage && (
                <View style={styles.reminderBox}>
                    <Text style={styles.reminderText}>⚠️ Flagship Event Alert!</Text>
                    <Text style={styles.reminderDetails}>{reminderMessage}</Text>
                </View>
            )}

            {role === "clubhead" && clubName && (
                <View>
                    {/* Create Update Button */}
                    <TouchableOpacity
                        style={styles.featureButton}
                        onPress={() => navigation.navigate("CreateUpdate")}
                    >
                        <Text style={styles.featureText}>+ Create Update</Text>
                    </TouchableOpacity>

                    {/* 2. CONSOLIDATED AI FEATURE BLOCK */}
                    <View style={styles.aiFeatureContainer}>
                        <Text style={styles.aiHeader}>🤖 Club Idea Generator</Text>
                        <Text style={styles.aiSubHeader}>Ideas for: {clubName}</Text>
                        
                        {/* AI BUTTON */}
                        <TouchableOpacity 
                            style={styles.aiGenerateButton} 
                            onPress={getClubIdeas} 
                            disabled={aiLoading}
                        >
                            {/* Display ActivityIndicator inside the button while loading */}
                            {aiLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.aiButtonText}>
                                    Generate 3 New Event Ideas
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Display Generated Ideas */}
                        {aiIdeas && aiIdeas.length > 0 && (
                            <View style={styles.aiIdeasList}>
                                <Text style={styles.aiListHeader}>✨ Suggested Ideas:</Text>
                                {aiIdeas.map((idea, index) => (
                                    <View key={index} style={styles.aiIdeaCard}>
                                        <Text style={styles.aiIdeaTitle}>{index + 1}. {idea.title}</Text>
                                        <Text style={styles.aiIdeaSummary}>{idea.summary}</Text>
                                        <Text style={styles.aiResourcesHeader}>Resources:</Text>
                                        <Text style={styles.aiResourcesText}>{Array.isArray(idea.resources) ? idea.resources.join(', ') : idea.resources}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            )}
            
            {role === "clubhead" && !clubName && (
                 <Text style={[styles.subtitle, { color: '#FF6B6B', fontWeight: 'bold' }]}>
                    ⚠️ Club data missing! Cannot load Idea Generator.
                 </Text>
            )}

            <Text style={styles.sectionHeader}>Latest Club Updates</Text>
        </View>
    );

    return (
        <View style={styles.mainView}>
            {/* 1. HORIZONTAL ANIMATED BACKGROUND */}
            {/* Show background animation only for students/general users to maximize visual impact */}
            {role === "student" && <FloatingBackground />} 
            
            {/* 2. MAIN CONTENT OVERLAY (List and Buttons) */}
            <View style={styles.contentOverlayMain}>
                <FlatList
                    ListHeaderComponent={headerContent} 
                    contentContainerStyle={styles.listContentContainer}
                    data={updates}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const clubImageSource = CLUB_IMAGE_MAP[item.clubName];
                        
                        return (
                            <ImageBackground
                                source={clubImageSource ? clubImageSource : CLUB_IMAGE_MAP.DEFAULT} 
                                style={styles.cardBackground}
                                imageStyle={styles.cardImageStyle}
                                key={item.id}
                            >
                                <TouchableOpacity
                                    style={styles.cardOverlay}
                                    onPress={() => navigation.navigate("UpdateDetails", { update: item })}
                                >
                                    <Text style={styles.cardClubName}>{item.clubName}</Text>
                                    
                                    <Text style={styles.cardTitleBold}>{item.title}</Text>
                                    
                                    <Text style={styles.cardDescriptionBold} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                    
                                    <Text style={styles.cardMetaFooter}>
                                        By {item.clubHeadName || item.author}
                                    </Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        );
                    }}
                />

                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Image
                            source={require("../assets/images/logo.png")}
                            style={{ width: 65, height: 65, marginBottom: 6 }}
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
    mainView: { 
        flex: 1, 
        backgroundColor: "#0F1A2C", // Dark background for contrast 
    },
    // Styles for the Horizontal Floating Background
    backgroundWrapper: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8, // Overall brightness for the background animation
        overflow: 'hidden',
    },
    floatingContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 2.5, // Large enough width for horizontal scroll effect
        height: '100%',
        alignItems: 'center',
    },
    floatingImage: {
        width: SCREEN_WIDTH / 2, // Large and visible
        height: '80%',
        marginHorizontal: 10,
        borderRadius: 8,
        opacity: 1, // Individual image opacity is high (controlled by wrapper)
    },
    contentOverlayMain: {
        // Semi-transparent overlay for legibility, replacing the white background
        flex: 1,
        backgroundColor: 'rgba(15, 26, 44, 0.7)', 
    },
    listContentContainer: { paddingBottom: 20 },
    topLogo: { width: 120, height: 120, alignSelf: "center", marginBottom: 20, marginTop: 10 },
    title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 10, color: "white", textShadowColor: '#000', textShadowRadius: 3 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#ccc" },
    
    featureButton: { backgroundColor: "#4DB0FF", borderRadius: 12, padding: 14, alignItems: "center", marginVertical: 10 },
    featureText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    
    sectionHeader: { fontSize: 18, fontWeight: '900', marginTop: 15, marginBottom: 10, color: "white", paddingHorizontal: 20, textShadowColor: '#000', textShadowRadius: 3 },
    
    // --- UPDATE CARD STYLES ---
    cardBackground: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 12,
        overflow: 'hidden', 
        height: 150, 
        elevation: 5,
    },
    cardImageStyle: {
        opacity: 0.75, 
        resizeMode: 'cover',
    },
    cardOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    cardClubName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFD700', 
        marginBottom: 5,
    },
    cardTitleBold: { 
        fontSize: 22, 
        fontWeight: '900', 
        color: 'white', 
    },
    cardDescriptionBold: {
        fontSize: 16, 
        fontWeight: '700', 
        color: 'white',
        flex: 1,
    },
    cardMetaFooter: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'right',
        marginTop: 5,
    },
    // --- NEARBY EVENTS CARD STYLES ---
    nearbyEventsBlock: {
        marginVertical: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 0,
    },
    nearbyEventsScrollView: {
        paddingHorizontal: 20, // Add padding to the horizontal scroll view
        paddingRight: 40, // Extra padding at the end of the list
    },
    nearbyHeader: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4DB0FF', // Bright blue for attention
        marginBottom: 10,
        paddingHorizontal: 20,
        textShadowColor: '#000', textShadowRadius: 1,
    },
    nearbyCardBackground: {
        width: SCREEN_WIDTH * 0.75, 
        height: 120,
        marginRight: 15, // Space between cards
        borderRadius: 10,
        overflow: 'hidden',
    },
    nearbyCardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        justifyContent: 'space-around',
    },
    nearbyCardClubName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    nearbyCardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        textShadowColor: '#000', textShadowRadius: 2,
    },
    nearbyCardDate: {
        fontSize: 14,
        color: '#ddd',
        fontWeight: '600',
    },
    // --- CONSOLIDATED AI FEATURE STYLES ---
    aiFeatureContainer: { 
        borderWidth: 1, 
        borderColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 20, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        marginHorizontal: 20,
    },
    aiHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: 'white' },
    aiSubHeader: { fontSize: 13, marginBottom: 10, color: '#ccc' },
    aiGenerateButton: { 
        backgroundColor: "#6A5ACD", 
        borderRadius: 8, 
        padding: 12, 
        alignItems: "center", 
        marginVertical: 5 
    },
    aiButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    aiIdeasList: { marginTop: 15 },
    aiListHeader: { fontSize: 15, fontWeight: 'bold', marginBottom: 5, color: '#FFD700' },
    aiIdeaCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#4DB0FF', 
        elevation: 1,
    },
    aiIdeaTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3, color: 'white' },
    aiIdeaSummary: { fontSize: 13, color: '#ccc', marginBottom: 5, fontStyle: 'italic' },
    aiResourcesHeader: { fontSize: 12, fontWeight: '600', color: '#4DB0FF' },
    aiResourcesText: { fontSize: 12, color: '#ccc' },

    // REMINDER STYLES (Adjusted for dark background)
    reminderBox: {
        backgroundColor: 'rgba(255, 107, 107, 0.3)', 
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#FF6B6B',
        elevation: 3,
        marginHorizontal: 20,
    },
    reminderText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white', 
        marginBottom: 5,
        textShadowColor: '#000', textShadowRadius: 1,
    },
    reminderDetails: {
        fontSize: 14,
        color: '#eee',
    },
    footer: { alignItems: "center", marginTop: 10 },
    watermark: { fontSize: 14, color: "white", fontWeight: "600" },
});