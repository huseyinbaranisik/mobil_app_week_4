import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SettingsModal = ({
  visible,
  onClose,
  settings,
  updateSettings,
}) => {
  const { isDarkMode, statsSpeed, isSoundEnabled } = settings;

  const speeds = [
    { label: 'Yavaş', value: 0.5 },
    { label: 'Normal', value: 1 },
    { label: 'Hızlı', value: 2 },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={[styles.modalContainer, isDarkMode ? styles.darkModal : styles.lightModal]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Ayarlar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDarkMode ? "#F5E6D3" : "#333" }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tema Ayarı */}
          <View style={styles.settingItem}>
            <View>
              <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Koyu Tema</Text>
              <Text style={styles.settingSubLabel}>Uygulama görünümünü değiştir</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={(val) => updateSettings('isDarkMode', val)}
              trackColor={{ false: '#767577', true: '#C8A2E8' }}
              thumbColor={isDarkMode ? '#F5E6D3' : '#f4f3f4'}
            />
          </View>

          {/* Azalma Hızı Ayarı */}
          <View style={styles.settingItemCol}>
            <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Azalma Hızı</Text>
            <Text style={styles.settingSubLabel}>Açlık ve mutluluğun düşme hızı</Text>
            <View style={styles.speedGrid}>
              {[
                { label: 'Yavaş', value: 1 },
                { label: 'Normal', value: 2 },
                { label: 'Hızlı', value: 4 },
              ].map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[
                    styles.speedOption,
                    statsSpeed === s.value && styles.speedSelected,
                    { borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                  ]}
                  onPress={() => updateSettings('statsSpeed', s.value)}
                >
                  <Text style={[
                    styles.speedText,
                    statsSpeed === s.value ? styles.speedTextSelected : (isDarkMode ? styles.darkText : styles.lightText)
                  ]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ses Ayarı */}
          <View style={styles.settingItem}>
            <View>
              <Text style={[styles.settingLabel, isDarkMode ? styles.darkText : styles.lightText]}>Hayvan Sesleri</Text>
              <Text style={styles.settingSubLabel}>Hayvan değişiminde ses çıkar</Text>
            </View>
            <Switch
              value={isSoundEnabled}
              onValueChange={(val) => updateSettings('isSoundEnabled', val)}
              trackColor={{ false: '#767577', true: '#C8A2E8' }}
              thumbColor={isSoundEnabled ? '#F5E6D3' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Tamam</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  darkModal: {
    backgroundColor: '#2A2D3E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  lightModal: {
    backgroundColor: '#F5E6D3',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  darkText: { color: '#F5E6D3' },
  lightText: { color: '#1A1A2E' },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingItemCol: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingSubLabel: {
    fontSize: 12,
    color: 'rgba(128,128,128,0.7)',
    marginTop: 2,
  },
  speedGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  speedOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  speedSelected: {
    backgroundColor: '#C8A2E8',
    borderColor: '#C8A2E8',
  },
  speedText: {
    fontSize: 13,
    fontWeight: '600',
  },
  speedTextSelected: {
    color: '#1A1A2E',
  },
  doneButton: {
    backgroundColor: '#C8A2E8',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#1A1A2E',
    fontWeight: '800',
    fontSize: 16,
  },
  closeButton: {
    padding: 4,
  }
});

export default SettingsModal;
