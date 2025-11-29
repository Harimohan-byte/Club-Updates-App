import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert, // Using Alert for better mobile feedback
    ImageBackground,
} from "react-native";
import { auth, db } from "../firebaseconfig";

// --- CLUB IMAGE MAPPING (Required for Preview Wallpaper) ---
// NOTE: These paths MUST be correct relative to your project structure.
const CLUB_IMAGE_MAP = {
    "Atharv": require('../assets/images/ATHARV.png'),
    "AI ML CLUB": require('../assets/images/AIML.png'),
    "E- CELL": require('../assets/images/ECELL.png'),
    "Money Matters": require('../assets/images/MONEYMATTERS.png'),
    "Igniters": require('../assets/images/IGNITERS.png'),
    "Capriccio": require('../assets/images/CAPRICIO.png'),
    "Club de Theatre": require('../assets/images/CLUBDETHEATRE.png'),
    "The Society of Coders": require('../assets/images/TSOC.png'),
    "DEFAULT": require('../assets/images/DEFAULT.png'), // Fallback for safety
};
// --- END CLUB IMAGE MAPPING ---


export default function CreateUpdate({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // NEW STATE: For event timing
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");

    const [loading, setLoading] = useState(false);

    // clubHeadInfo now includes clubName and post
    const [clubHeadInfo, setClubHeadInfo] = useState(null); 
    const [isInfoLoading, setIsInfoLoading] = useState(true);

    // fetch club head details from Firestore
    useEffect(() => {
        const fetchClubHeadInfo = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) {
                setIsInfoLoading(false);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    setClubHeadInfo(userDoc.data());
                }
            } catch (err) {
                console.error("Error fetching club head info:", err);
                Alert.alert("Error", "Could not load user data.");
            } finally {
                setIsInfoLoading(false);
            }
        };

        fetchClubHeadInfo();
    }, []);

    const postUpdate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Error", "Please fill in title and description.");
            return;
        }

        // Ensure we have the necessary club data before posting
        if (!clubHeadInfo || !clubHeadInfo.clubName) {
             Alert.alert("Error", "Club information is missing. Cannot post update.");
             return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "updates"), {
                title,
                description,
                
                // NEW: Save event date and time
                eventDate: eventDate.trim() || "TBA", // Save date, default to TBA if empty
                eventTime: eventTime.trim() || "TBA", // Save time, default to TBA if empty

                createdAt: new Date(),
                author: auth.currentUser.email,
                
                // Attach club name and head details
                clubName: clubHeadInfo.clubName, 
                clubHeadName: clubHeadInfo.name || "",
                clubHeadPost: clubHeadInfo.post || "",
            });

            Alert.alert("Success", "Update posted successfully!");
            navigation.goBack();
        } catch (err) {
            console.error("Error posting update:", err);
            Alert.alert("Failed", "Failed to post update.");
        } finally {
            setLoading(false);
        }
    };
    
    // Determine the image source for the preview
    const clubImageSource = clubHeadInfo 
        ? CLUB_IMAGE_MAP[clubHeadInfo.clubName] 
        : CLUB_IMAGE_MAP.DEFAULT;

    // Show loading indicator while fetching user data
    if (isInfoLoading) {
         return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4DB0FF" />
                <Text style={{ marginTop: 10 }}>Fetching Club Details...</Text>
            </View>
        );
    }
    
    // Final check for missing club data after loading
    if (!clubHeadInfo || !clubHeadInfo.clubName) {
        return (
            <View style={styles.container}>
                <Text style={[styles.heading, {color: '#FF6B6B'}]}>Access Denied</Text>
                <Text style={{ textAlign: 'center', marginHorizontal: 20 }}>
                    You must be a registered Club Head with an assigned club to post updates. Please contact the administrator.
                </Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        );
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Create New Update</Text>

            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 100 }]}
                multiline
            />
            
            {/* NEW: Event Date and Time Inputs */}
            <View style={styles.dateRow}>
                <TextInput
                    placeholder="Event Date (e.g., Dec 25, 2025)"
                    value={eventDate}
                    onChangeText={setEventDate}
                    style={[styles.input, styles.halfInput]}
                />
                <TextInput
                    placeholder="Event Time (e.g., 6:00 PM)"
                    value={eventTime}
                    onChangeText={setEventTime}
                    style={[styles.input, styles.halfInput]}
                />
            </View>


            {/* PREVIEW BOX WITH IMAGE BACKGROUND */}
            <ImageBackground
                source={clubImageSource}
                style={styles.previewBackground}
                imageStyle={styles.previewImageStyle}
            >
                <View style={styles.previewOverlay}>
                    <Text style={styles.previewClubName}>
                        {clubHeadInfo.clubName} Update Preview
                    </Text>
                    
                    {/* NEW: Display Date and Time in Preview */}
                    <Text style={styles.previewDate}>
                        Date: {eventDate || 'TBA'} @ Time: {eventTime || 'TBA'}
                    </Text>

                    <Text style={styles.previewPostTitle}>
                        {clubHeadInfo.post}
                    </Text>
                    <Text style={styles.previewMeta}>
                        By {clubHeadInfo.name}
                    </Text>
                </View>
            </ImageBackground>


            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#4DB0FF" />
            ) : (
                <Button title="Post Update" onPress={postUpdate} color="#4DB0FF" />
            )}
            
            <Button title="Cancel" onPress={() => navigation.goBack()} color="#ccc" style={{ marginTop: 10 }} />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fafafa",
    },
    // NEW STYLES: For date and time layout
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfInput: {
        width: '48%',
        marginBottom: 0,
    },
    // --- PREVIEW STYLES ---
    previewBackground: {
        height: 140, // Increased height slightly to fit new date/time info
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
    },
    previewImageStyle: {
        opacity: 0.8, 
        resizeMode: 'cover',
    },
    previewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        padding: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    previewClubName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFD700', 
    },
    // NEW: Style for Date and Time preview
    previewDate: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        marginTop: 5,
        marginBottom: 5,
    },
    previewPostTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    previewMeta: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});