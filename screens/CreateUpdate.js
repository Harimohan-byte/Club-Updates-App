import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function CreateUpdate({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const postUpdate = async () => {
    try {
      await addDoc(collection(db, "updates"), {
        title,
        description,
        author: auth.currentUser.email,
        createdAt: new Date(),
      });
      navigation.goBack();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput style={{ borderWidth: 1, marginVertical: 10 }} value={title} onChangeText={setTitle} />
      <Text>Description</Text>
      <TextInput style={{ borderWidth: 1, marginVertical: 10 }} value={description} onChangeText={setDescription} />
      <Button title="Post Update" onPress={postUpdate} />
    </View>
  );
}
