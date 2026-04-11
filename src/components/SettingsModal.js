import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { 
  X, 
  Trash2, 
  User, 
  Check,
  RotateCcw
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const SettingsModal = ({ visible, onClose, user, updateProfile, resetGameState }) => {
  const [pseudo, setPseudo] = useState(user.pseudo);
  const [sexe, setSexe] = useState(user.sexe);

  const handleSaveProfile = () => {
    if (!pseudo.trim()) return;
    updateProfile(pseudo, sexe);
    Alert.alert("SYSTÈME", "Profil mis à jour avec succès.");
  };

  const handleReset = () => {
    Alert.alert(
      "ALERTE CRITIQUE",
      "Voulez-vous réinitialiser tout le système ? Cette action est irréversible.",
      [
        { text: "ANNULER", style: "cancel" },
        { 
          text: "RÉINITIALISER", 
          onPress: () => {
             Alert.alert(
               "DERNIÈRE CONFIRMATION",
               "Es-tu vraiment sûr, Chasseur ? Toutes tes statistiques seront perdues.",
               [
                 { text: "NON", style: "cancel" },
                 { text: "OUI, TOUT EFFACER", style: "destructive", onPress: () => {
                   resetGameState();
                   onClose();
                 }}
               ]
             );
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient 
          colors={['#0a0a0a', '#000']} 
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSubtitle}>CONFIGURATION</Text>
              <Text style={styles.headerTitle}>PARAMÈTRES SYSTÈME</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MODIFIER LE PROFIL</Text>
            <View style={styles.inputCard}>
              <Text style={styles.label}>PSEUDO</Text>
              <TextInput
                style={styles.input}
                value={pseudo}
                onChangeText={setPseudo}
                placeholderTextColor="#444"
              />
            </View>

            <View style={styles.sexSelection}>
              <TouchableOpacity 
                style={[styles.sexBtn, sexe === 'homme' && styles.sexBtnActive]}
                onPress={() => setSexe('homme')}
              >
                <Text style={[styles.sexBtnText, sexe === 'homme' && styles.sexBtnTextActive]}>HOMME</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sexBtn, sexe === 'femme' && styles.sexBtnActive]}
                onPress={() => setSexe('femme')}
              >
                <Text style={[styles.sexBtnText, sexe === 'femme' && styles.sexBtnTextActive]}>FEMME</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Check size={18} color="#000" />
              <Text style={styles.saveBtnText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.section, styles.dangerZone]}>
            <Text style={styles.dangerTitle}>ZONE DE DANGER</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={18} color="#ff0055" />
              <Text style={styles.resetBtnText}>RÉINITIALISER TOUT LE SYSTÈME</Text>
            </TouchableOpacity>
            <Text style={styles.dangerDesc}>
              Cette action effacera tes niveaux, titres, statistiques et historique de quêtes.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { height: height * 0.8, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 25 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  headerSubtitle: { color: '#888', fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

  section: { marginBottom: 40 },
  sectionTitle: { color: '#00f2ff', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  
  inputCard: { marginBottom: 20 },
  label: { fontSize: 9, color: '#444', fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#222' },
  
  sexSelection: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  sexBtn: { flex: 1, padding: 15, borderRadius: 10, borderWith: 1, borderColor: '#222', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  sexBtnActive: { borderColor: '#00f2ff', backgroundColor: 'rgba(0,242,255,0.05)' },
  sexBtnText: { color: '#444', fontWeight: 'bold', fontSize: 12 },
  sexBtnTextActive: { color: '#00f2ff' },
  
  saveBtn: { backgroundColor: '#00f2ff', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  saveBtnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },

  dangerZone: { marginTop: 20, paddingTop: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,0,85,0.1)' },
  dangerTitle: { color: '#ff0055', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,0,85,0.2)', backgroundColor: 'rgba(255,0,85,0.02)', marginBottom: 15 },
  resetBtnText: { color: '#ff0055', fontWeight: 'bold', fontSize: 12 },
  dangerDesc: { color: '#333', fontSize: 10, textAlign: 'center', fontStyle: 'italic' }
});

export default SettingsModal;
