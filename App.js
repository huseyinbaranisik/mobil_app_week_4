import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DigitalPet from './components/DigitalPet';
import SettingsModal from './components/SettingsModal';
import SplashScreen from './components/SplashScreen';

const { width } = Dimensions.get('window');

const lightStyles = { bg: '#F5E6D3', text: '#1A1A2E' };
const darkStyles  = { bg: '#1A1A2E', text: '#F5E6D3' };

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    isDarkMode: true,
    statsSpeed: 2, 
    isSoundEnabled: true,
  });

  // 🔔 Global Bildirim State ve Animasyonu
  const [notif, setNotif] = useState({ visible: false, title: '', icon: '' });
  const notifAnim = useRef(new Animated.Value(-300)).current;

  const showGlobalNotif = (title, icon) => {
    setNotif({ visible: true, title, icon });
    Animated.sequence([
      Animated.spring(notifAnim, { toValue: 60, friction: 6, tension: 50, useNativeDriver: true }),
      Animated.delay(3500),
      Animated.timing(notifAnim, { toValue: -300, duration: 800, useNativeDriver: true }),
    ]).start(() => setNotif(p => ({ ...p, visible: false })));
  };

  useEffect(() => {
    // Diğer bileşenlerin erişimi için global'e kaydet
    global.showGlobalNotif = showGlobalNotif;
  }, []);

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const themeStyles = settings.isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.bg }]}>
        <View style={[styles.container, { backgroundColor: themeStyles.bg }]}>
          
          {/* Üst Minimalist Header */}
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.headerIconLeft} 
              onPress={() => global.openAchievements && global.openAchievements()}
            >
              <Text style={{ fontSize: 26 }}>🏆</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: themeStyles.text }]}>DİJİTAL EVCİL HAYVANIM</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingsIcon} 
              onPress={() => setShowSettings(true)}
            >
              <Text style={{ fontSize: 26 }}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Ana Oyun Alanı */}
          <View style={styles.mainContent}>
            <DigitalPet 
              isim="Ponçik" 
              settings={settings}
            />
          </View>

          {/* Ayarlar Modalı (Modal'lar genellikle her şeyin üstünde çıkar ama splash sırasında kapalı olmalılar) */}
          <SettingsModal 
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            updateSettings={updateSettings}
          />

          <StatusBar style={settings.isDarkMode ? "light" : "dark"} />

          {/* 🔔 GLOBAL BİLDİRİM */}
          <Animated.View style={[styles.notification, { transform: [{ translateY: notifAnim }] }]}>
            <View style={styles.notifContent}>
              <Text style={{ fontSize: 32, marginRight: 15 }}>{notif.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>BİLGİ / BAŞARIM</Text>
                <Text style={styles.notifName}>{notif.title}</Text>
              </View>
            </View>
          </Animated.View>

        </View>
      </SafeAreaView>

      {/* 🚀 SPLASH SCREEN - Mutlak en üst katman olması için SafeAreaView dışına ve en sona alındı */}
      {isSplashVisible && (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 45,
    height: 60,
    zIndex: 100, // Header zIndex'i düşürüldü
  },
  titleContainer: { alignItems: 'center' },
  title: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.8,
  },
  headerIconLeft: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  settingsIcon: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  mainContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  // 🔔 Bildirim Stilleri
  notification: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999999, // Mutlak en üst katman
  },
  notifContent: {
    width: width * 0.95,
    backgroundColor: '#2D2438',
    padding: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#C8A2E8',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 200, // Android için çok yüksek elevation
  },
  notifTitle: { color: '#C8A2E8', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  notifName: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});
