// screens/CreateUpdate.js
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
} from "react-native";
import { auth, db } from "../firebase";

export default function CreateUpdate({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // auto-filled club head info
  const [clubHeadInfo, setClubHeadInfo] = useState(null);

  // fetch club head details from Firestore
  useEffect(() => {
    const fetchClubHeadInfo = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setClubHeadInfo(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching club head info:", err);
      }
    };

    fetchClubHeadInfo();
  }, []);

  const postUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in title and description.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "updates"), {
        title,
        description,
        createdAt: new Date(),
        author: auth.currentUser.email,

        // attach club head details automatically
        clubHeadName: clubHeadInfo?.name || "",
        clubHeadPost: clubHeadInfo?.post || "",
        clubDescription: clubHeadInfo?.clubDescription || "",
      });

      alert("Update posted successfully!");
      navigation.goBack();
    } catch (err) {
      console.error("Error posting update:", err);
      alert("Failed to post update.");
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Post Update" onPress={postUpdate} />
      )}

      {clubHeadInfo && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>Posting As:</Text>
          <Text>{clubHeadInfo.name}</Text>
          <Text>{clubHeadInfo.post}</Text>
          <Text style={{ fontStyle: "italic" }}>{clubHeadInfo.clubDescription}</Text>
        </View>
      )}
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  previewBox: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
});
