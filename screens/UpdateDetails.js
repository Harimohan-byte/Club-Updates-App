import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions, Alert, Platform } from 'react-native';

// --- CLUB IMAGE MAPPING (Duplicated for file independence) ---
// NOTE: These MUST match the paths in your CreateUpdate.js and Dashboard.js
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
// --- END CLUB IMAGE MAPPING ---


export default function UpdateDetails({ route, navigation }) {
    // Expects the full update object passed via navigation (item is the update)
    const { update } = route.params; 

    if (!update || !update.clubName) {
        // Fallback if data is missing
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Update details not found or missing club information.</Text>
            </View>
        );
    }

    // Determine the correct image source
    const clubImageSource = CLUB_IMAGE_MAP[update.clubName] 
        ? CLUB_IMAGE_MAP[update.clubName] 
        : CLUB_IMAGE_MAP.DEFAULT;

    // Format timestamp (handles Firebase timestamp or JS Date/String)
    const date = update.createdAt?.toDate 
        ? update.createdAt.toDate().toLocaleDateString() 
        : new Date(update.createdAt).toLocaleDateString() || 'N/A';

    return (
        // Apply ImageBackground to the entire screen view
        <ImageBackground
            source={clubImageSource}
            style={styles.mainBackground}
            imageStyle={styles.mainImageStyle}
        >
            {/* Overlay set to TRANSPARENT */}
            <View style={styles.contentOverlay}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    
                    {/* TOP SECTION: Title and Club Name */}
                    <View style={styles.header}>
                        <Text style={styles.clubNameHeader}>{update.clubName}</Text>
                        <Text style={styles.titleHeader}>{update.title}</Text>
                    </View>

                    {/* DETAILS SECTION: Description and Meta Info */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{update.description}</Text>

                        <View style={styles.metaContainer}>
                            <Text style={styles.metaLabel}>Date & Time:</Text>
                            {/* Displaying Date and Time fields from CreateUpdate.js */}
                            <Text style={styles.metaValue}>
                                {update.eventDate || 'TBA'} @ {update.eventTime || 'TBA'}
                            </Text>

                            <Text style={styles.metaLabel}>Posted By:</Text>
                            <Text style={styles.metaValue}>{update.clubHeadName || update.author}</Text>
                            
                            <Text style={styles.metaLabel}>Position:</Text>
                            <Text style={styles.metaValue}>{update.clubHeadPost || 'N/A'}</Text>
                            
                            <Text style={styles.metaLabel}>Posted On:</Text>
                            <Text style={styles.metaValue}>{date}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    mainBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    // Increased image opacity to be fully visible
    mainImageStyle: {
        opacity: 0.8, 
        resizeMode: 'cover',
    },
    contentOverlay: {
        flex: 1,
        // FIX: Set to fully transparent so the image dominates the background
        backgroundColor: 'rgba(0, 0, 0, 0.0)', 
    },
    scrollViewContent: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20, 
        paddingBottom: 40,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 18,
    },
    // --- HEADER STYLES ---
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
        paddingBottom: 15,
        // Removed border as it won't look right over a fully visible image
    },
    clubNameHeader: {
        fontSize: 22, // INCREASED SIZE
        fontWeight: '900', // INCREASED BOLDNESS
        color: '#FFD700', // Gold color
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.9)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    titleHeader: {
        fontSize: 32, // INCREASED SIZE
        fontWeight: '900', // MAX BOLDNESS
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.9)', 
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5, // HEAVIER SHADOW
    },
    // --- DETAILS STYLES ---
    detailsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 26, // INCREASED SIZE
        fontWeight: '900', // MAX BOLDNESS
        color: 'white', 
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)', 
        textShadowColor: 'rgba(0, 0, 0, 0.9)', 
        textShadowOffset: { width: 1.5, height: 1.5 },
        textShadowRadius: 3,
    },
    descriptionText: {
        fontSize: 20, // INCREASED SIZE
        lineHeight: 30, // Increased line height for readability
        color: '#F0F0F0', 
        marginBottom: 30,
        fontWeight: '700', // BOLDED
        textShadowColor: 'rgba(0, 0, 0, 0.7)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    metaContainer: {
        paddingTop: 10,
    },
    metaLabel: {
        fontSize: 18, // INCREASED SIZE
        fontWeight: 'bold',
        color: '#4DB0FF', // Blue accent color
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.9)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    metaValue: {
        fontSize: 18, // INCREASED SIZE
        color: '#E0E0E0', // Light grey for value
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.9)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});