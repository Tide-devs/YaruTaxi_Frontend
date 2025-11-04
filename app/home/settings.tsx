import { apiGet, apiPut } from "@/services/api";
import React, { useEffect, useState } from "react";
import {
 ActivityIndicator,
 Alert,
 KeyboardAvoidingView,
 Platform,
 StyleSheet,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from "react-native";

interface UserProfile {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  accountStatus: string;
  role: string;
  createdAt: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await apiGet("user/profile");
        setProfile(data);
      } catch (error) {
        console.error("Error cargando el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleToggleEdit = async () => {
    if (!profile) return;

    // Si se está guardando, hace el PUT
    if (editMode) {
      try {
        const updatedData = {
          name: profile.name,
          lastName: profile.lastName,
          phone: profile.phone,
        };

        // 👇 Aquí se pasa el id directamente en la URL
        await apiPut('user/profile', updatedData, false);
        Alert.alert("Guardado", "Los cambios se guardaron correctamente ✅");
      } catch (error) {
        console.error("Error guardando cambios:", error);
        Alert.alert("Error", "No se pudieron guardar los cambios ❌");
      }
    }

    setEditMode(!editMode);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        <TextInput
          style={styles.input}
          value={profile.name}
          editable={editMode}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          placeholder="Nombre"
        />
        <TextInput
          style={styles.input}
          value={profile.lastName}
          editable={editMode}
          onChangeText={(text) => setProfile({ ...profile, lastName: text })}
          placeholder="Apellido"
        />
        <TextInput
          style={styles.input}
          value={profile.email}
          editable={false}
          placeholder="Correo"
        />
        <TextInput
          style={styles.input}
          value={profile.phone}
          editable={editMode}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
          placeholder="Teléfono"
        />
        <TextInput
          style={styles.input}
          value={profile.accountStatus}
          editable={false}
          placeholder="Estado"
        />
        <TextInput
          style={styles.input}
          value={profile.role}
          editable={false}
          placeholder="Rol"
        />

        <TouchableOpacity style={styles.button} onPress={handleToggleEdit}>
          <Text style={styles.buttonText}>
            {editMode ? "Guardar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
