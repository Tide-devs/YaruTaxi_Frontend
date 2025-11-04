import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";

import { deleteToken } from "@/services/api";
import { router } from "expo-router";

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImUzODBmODVkMDJiZDQzMmViYTExMTg3NzUwODMxMGYxIiwiaCI6Im11cm11cjY0In0="

type FormData = { from: string; to: string };
type Markers = { from: LatLng | null; to: LatLng | null };

export default function Home() {
 const [formData, setFormData] = useState<FormData>({ from: "", to: "" });
 const [markers, setMarkers] = useState<Markers>({ from: null, to: null });
 const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
 const [loading, setLoading] = useState(false);
 const [travelInfo, setTravelInfo] = useState<{ distance: number; duration: number } | null>(null);
 const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

 const getAddressFromCoords = async (coords: LatLng) => {
  try {
   const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`;
   const res = await fetch(url, { headers: { "User-Agent": "expo-app-yarutax" } });
   const data = await res.json();
   return data.display_name || "";
  } catch (err) {
   console.error("Reverse geocode error:", err);
   return "";
  }
 };

 const mapRef = useRef<MapView>(null);

 const region: Region = {
  latitude: 6.963333,
  longitude: -75.417222,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
 };

 const getCoordsFromAddress = async (address: string): Promise<LatLng | null> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length > 0) {
   return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  }
  return null;
 };

 const fetchRoute = async (fromCoords: LatLng, toCoords: LatLng) => {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${fromCoords.longitude},${fromCoords.latitude}&end=${toCoords.longitude},${toCoords.latitude}`;
  const res = await fetch(url);
  const json = await res.json();

  const coords: LatLng[] = json.features[0].geometry.coordinates.map(
   ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
  );

  setRouteCoords(coords);

  const summary = json.features[0].properties.summary;
  setTravelInfo({
   distance: summary.distance / 1000,
   duration: summary.duration / 60,
  });

  // Centrar cámara solo en los marcadores
  if (fromCoords && toCoords) {
   const latDelta = Math.abs(fromCoords.latitude - toCoords.latitude) * 1.5;
   const lngDelta = Math.abs(fromCoords.longitude - toCoords.longitude) * 1.5;
   const region = {
    latitude: (fromCoords.latitude + toCoords.latitude) / 2,
    longitude: (fromCoords.longitude + toCoords.longitude) / 2,
    latitudeDelta: Math.max(latDelta, 0.02),
    longitudeDelta: Math.max(lngDelta, 0.02),
   };
   mapRef.current?.animateToRegion(region, 500);
  }
 };

 useEffect(() => {
  const calculateRoute = async () => {
   if (formData.from && formData.to) {
    const fromCoords = await getCoordsFromAddress(formData.from);
    const toCoords = await getCoordsFromAddress(formData.to);
    if (!fromCoords || !toCoords) {
     setRouteCoords([]);
     setTravelInfo(null);
     return;
    }
    setMarkers({ from: fromCoords, to: toCoords });
    setLoading(true);
    try { await fetchRoute(fromCoords, toCoords); }
    catch (err) { console.error(err); Alert.alert("Error", "No se pudo calcular la ruta"); }
    finally { setLoading(false); }
   }
  };
  calculateRoute();
 }, [formData.from, formData.to]);

 useEffect(() => {
  if (!formData.from || !formData.to) {
   setRouteCoords([]);
   setTravelInfo(null);
  }
 }, [formData.from, formData.to]);


 const formatDuration = (duration: number) => {
  if (duration < 60) return `${duration.toFixed(0)} min`;
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  return `${hours} h ${minutes} min`;
 };

 const handleLogout = async () => {
  Alert.alert('Do you want to log in?', '',
   [
    { text: 'No', style: 'cancel' },
    {
     text: 'Yes',
     onPress: async () => {
      await deleteToken();
      router.push('/auth/login');
     }
    },
   ]
  );
 }

 return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
   <View style={styles.header}>
    <Text style={styles.headerText}>Yarutax</Text>
    <TouchableOpacity onPress={() => handleLogout()}>
     <Ionicons name="log-out-outline" size={30} color="#000" />
    </TouchableOpacity>
   </View>

   <View style={styles.body}>
    <View style={styles.bodyHeaderContainer}>
     <MapView ref={mapRef} style={styles.map} initialRegion={region}
      onPress={async (e) => {
       if (!activeInput) return;
       const coords = e.nativeEvent.coordinate;
       const address = await getAddressFromCoords(coords);
       setFormData(prev => ({ ...prev, [activeInput]: address }));
       setMarkers(prev => ({ ...prev, [activeInput]: coords }));
      }}
     >
      {markers.from && <Marker coordinate={markers.from} title="Origen" pinColor="green" />}
      {markers.to && <Marker coordinate={markers.to} title="Destino" pinColor="red" />}
      {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeColor="#000" strokeWidth={4} />}
     </MapView>

     <View style={styles.form}>
      <View style={styles.inputGroup}>
       <Text style={styles.inputLabel}>From</Text>
       <View style={styles.inputRow}>
        <TextInput placeholder="Ej: Cl. 10 #45-30 Medellín" value={formData.from} onFocus={() => setActiveInput("from")} onChangeText={text => setFormData(prev => ({ ...prev, from: text }))} style={styles.input} />
        {formData.from.length > 0 && (
         <TouchableOpacity onPress={() => { setFormData(prev => ({ ...prev, from: "" })); setMarkers(prev => ({ ...prev, from: null })) }}>
          <Text style={styles.clearBtn}>✕</Text>
         </TouchableOpacity>
        )}
       </View>
      </View>

      <View style={styles.inputGroup}>
       <Text style={styles.inputLabel}>To</Text>
       <View style={styles.inputRow}>
        <TextInput placeholder="Ej: Centro Comercial Santafé Medellín" value={formData.to} style={styles.input} onFocus={() => setActiveInput("to")} onChangeText={text => setFormData(prev => ({ ...prev, to: text }))} />
        {formData.to.length > 0 && (
         <TouchableOpacity onPress={() => { setFormData(prev => ({ ...prev, to: "" })); setMarkers(prev => ({ ...prev, to: null })) }}>
          <Text style={styles.clearBtn}>✕</Text>
         </TouchableOpacity>
        )}
       </View>
      </View>
     </View>

     {travelInfo && (
      <View style={styles.travelInfo}>
       <Text style={styles.travelText}>
        🕒 {formatDuration(travelInfo.duration)} • {travelInfo.distance.toFixed(2)} km
       </Text>
      </View>
     )}
    </View>

    <View style={styles.footer}>
     <TouchableOpacity style={[styles.button, (!formData.from || !formData.to) && { opacity: 0.5 }]} disabled={!formData.from || !formData.to || loading} onPress={() => { }} >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Search Driver</Text>}
     </TouchableOpacity>
    </View>
   </View>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: "#fff" },
 header: { marginTop: 50, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
 headerText: { fontSize: 20, fontWeight: "700" },
 body: { flex: 1, padding: 20 },
 bodyHeaderContainer: { flex: 1 },
 map: { width: "100%", flex: 1, borderRadius: 15 },
 form: { marginTop: 10 },
 inputGroup: { marginBottom: 10 },
 inputLabel: { fontWeight: "600", color: "#333", marginBottom: 5 },
 inputRow: { flexDirection: "row", alignItems: "center" },
 input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, backgroundColor: "#f9f9f9" },
 clearBtn: { marginLeft: 8, fontSize: 18, color: "#888" },
 footer: { alignItems: "center", marginVertical: 10 },
 button: { backgroundColor: "#000", paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
 buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
 travelInfo: { marginTop: 10, alignItems: "center" },
 travelText: { fontSize: 16, fontWeight: "500", color: "#333" },
});