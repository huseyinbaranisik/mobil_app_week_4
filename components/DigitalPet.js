import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { playAnimalSound, playClickSound } from './AudioManager';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// YARDIMCI FONKSİYONLAR
// ─────────────────────────────────────────────────────────────

const getTurEmoji = (tur) => {
  const turler = {
    Kedi: '🐱', Köpek: '🐶', Tavşan: '🐰', Kuş: '🐦',
    Hamster: '🐹', Balık: '🐠', Ejderha: '🐲', Unicorn: '🦄',
  };
  return turler[tur] || '🐾';
};

// ─────────────────────────────────────────────────────────────
// BİLEŞENLER
// ─────────────────────────────────────────────────────────────

const StatBar = ({ label, value, emoji, color, textColor }) => {
  const animatedWidth = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: value,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [value]);

  return (
    <View style={styles.statContainer}>
      <View style={styles.statHeader}>
        <Text style={[styles.statLabel, { color: textColor }]}>{emoji} {label}</Text>
        <Text style={[styles.statValue, { color: textColor, opacity: 0.6 }]}>{Math.round(value)}/100</Text>
      </View>
      <View style={styles.statBarBackground}>
        <Animated.View
          style={[
            styles.statBarFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const DigitalPet = ({ isim: defaultIsim, settings }) => {
  const { isDarkMode, statsSpeed, isSoundEnabled } = settings;

  // ── RPG / Level State ──
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isim, setIsim] = useState(defaultIsim || "Ponçik");
  const [tur, setTur] = useState('Kedi');
  const [unlockedAnimals, setUnlockedAnimals] = useState(['Kedi']);
  const [stats, setStats] = useState({ besleme: 0, oyun: 0, yikama: 0, uyku: 0, level_up: 0 });
  const [lastAction, setLastAction] = useState({ type: null, count: 0 });
  const [unlocked, setUnlocked] = useState([]);

  // ── Stat State ──
  const [tokluk, setTokluk]     = useState(100);
  const [mutluluk, setMutluluk] = useState(100);
  const [temizlik, setTemizlik] = useState(100);
  const [enerji, setEnerji]     = useState(80);

  // ── UI State ──
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditType, setShowEditType] = useState(false);
  const [tempText, setTempText] = useState('');

  // ── Per-Animal Action Counter ──
  const [animalActions, setAnimalActions] = useState({});

  // ── Refs ──
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sinkAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  // ── Tanımlar ──
  const BASARIM_TANIMLARI = [
    { id: 'lvl_2',    title: 'Acemi Eğitici',   desc: 'İlk kez seviye atladın!', count: 2,  key: 'level', icon: '🐣' },
    { id: 'lvl_10',   title: 'Pet Master',      desc: '10. Seviyeye ulaştın!', count: 10, key: 'level', icon: '👑' },
    { id: 'oyun_10',   title: 'İlk Adımlar',     desc: '10 kez oyna', count: 10,  key: 'oyun', icon: '👟' },
    { id: 'oyun_100',  title: 'Oyun Arkadaşı',   desc: '100 kez oyna', count: 100, key: 'oyun', icon: '🎾' },
    { id: 'oyun_1000', title: 'Ayrılmaz İkili',  desc: '1000 kez oyna', count: 1000, key: 'oyun', icon: '🏅' },
    { id: 'besle_10',   title: 'Atıştırmalık',   desc: '10 kez besle', count: 10,  key: 'besleme', icon: '🍪' },
    { id: 'besle_100',  title: 'Doyurucu Menü',  desc: '100 kez besle', count: 100, key: 'besleme', icon: '🍲' },
    { id: 'besle_1000', title: 'Ziyafet',        desc: '1000 kez besle', count: 1000, key: 'besleme', icon: '🍗' },
    { id: 'yika_10',    title: 'Suyla Tanışma',  desc: '10 kez yıka', count: 10,  key: 'yikama', icon: '💧' },
    { id: 'yika_100',   title: 'Köpüklü Banyo',  desc: '100 kez yıka', count: 100, key: 'yikama', icon: '🧼' },
    { id: 'yika_1000',  title: 'Pırıl Pırıl',    desc: '1000 kez yıka', count: 1000, key: 'yikama', icon: '💎' },
    { id: 'uyku_10',    title: 'Şekerleme',      desc: '10 kez uyut', count: 10,  key: 'uyku', icon: '🌥️' },
    { id: 'uyku_100',   title: 'Tatlı Rüyalar',  desc: '100 kez uyut', count: 100, key: 'uyku', icon: '🧸' },
    { id: 'uyku_1000',  title: 'Kış Uykusu',     desc: '1000 kez uyut', count: 1000, key: 'uyku', icon: '❄️' },
    { id: 'asiri_besle', title: 'Aşırı Besleme', desc: 'Tokken çok besledin!', count: 10, key: 'special_overfed', icon: '🤢' },
    { id: 'afacan',      title: 'Afacan',        desc: 'Sadece oyun düşündün!', count: 20, key: 'special_playful', icon: '🏃' },
    { id: 'uykucu_spec', title: 'Uykucu',        desc: 'Uykudan kalkamadın!', count: 10, key: 'special_sleeper', icon: '💤' },
    { id: 'kopek_sever', title: 'Köpek Sever',   desc: 'Köpek kilidini açtın!', count: 1, key: 'unlock_dog', icon: '🐕' },
    { id: 'hayvan_50',   title: 'Hayvan Sever 50/50', desc: '4 Hayvanın kilidi açık!', count: 4, key: 'collection_half', icon: '🥈' },
    { id: 'hayvan_full', title: 'Büyük Hayvan Sever', desc: 'Tüm hayvanlar açık!',   count: 8, key: 'collection_full', icon: '🥇' },
    // 🐾 Hayvana Özel Başarımlar (100 Eylem)
    { id: 'animal_kedi',    title: 'Kedi Dostu',         desc: 'Kedinle 100 eylem yaptın!',    count: 100, key: 'animal_Kedi',    icon: '😺' },
    { id: 'animal_kopek',   title: 'Köpek Biricik',      desc: 'Köpeğinle 100 eylem yaptın!',  count: 100, key: 'animal_Köpek',   icon: '🐕‍🦺' },
    { id: 'animal_tavsan',  title: 'Tavşan Bakıcısı',    desc: 'Tavşanınla 100 eylem yaptın!', count: 100, key: 'animal_Tavşan',  icon: '🥕' },
    { id: 'animal_kus',     title: 'Kuş Tüneği',         desc: 'Kuşunla 100 eylem yaptın!',    count: 100, key: 'animal_Kuş',     icon: '🪶' },
    { id: 'animal_hamster', title: 'Hamster Hız Ustası', desc: 'Hamsterinle 100 eylem yaptın!',count: 100, key: 'animal_Hamster', icon: '🐿️' },
    { id: 'animal_balik',   title: 'Denizin Efendisi',   desc: 'Balığınla 100 eylem yaptın!',  count: 100, key: 'animal_Balık',   icon: '🌊' },
    { id: 'animal_ejderha', title: 'Ejderha Terbiyecisi',desc: 'Ejderhanı ehlileştirdin!',     count: 100, key: 'animal_Ejderha', icon: '🔥' },
    { id: 'animal_unicorn', title: 'Unicorn Büyücüsü',   desc: 'Unicornla 100 büyü yaptın!',  count: 100, key: 'animal_Unicorn', icon: '✨' },
  ];

  const ANIMAL_UNLOCK_LEVELS = [
    { name: 'Kedi', level: 1 }, { name: 'Köpek', level: 2 },
    { name: 'Tavşan', level: 3 }, { name: 'Kuş', level: 4 },
    { name: 'Hamster', level: 5 }, { name: 'Balık', level: 6 },
    { name: 'Ejderha', level: 10 }, { name: 'Unicorn', level: 15 },
  ];

  // ── Mantık Fonksiyonları ──
  const showAchievementNotif = (b) => {
    // Ses çal
    playAnimalSound(tur, 'idle', isSoundEnabled); 
    // Global bildirimi çağır (App.js'deki fonksiyon)
    if (global.showGlobalNotif) {
        global.showGlobalNotif(b.title, b.icon);
    }
  };

  const checkAchievementManually = (id) => {
    if (!unlocked.includes(id)) {
      setUnlocked(prev => [...prev, id]);
      const ach = BASARIM_TANIMLARI.find(x => x.id === id);
      if (ach) showAchievementNotif(ach);
    }
  };

  const addXp = (amount) => {
    let newXp = xp + amount;
    const xpNeeded = level * 100;
    if (newXp >= xpNeeded) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(newXp - xpNeeded);
      // Level başarımlarını kontrol et (Sessizce, bildirim başarım üzerinden gelecek)
      const lvlAch = BASARIM_TANIMLARI.find(b => b.key === 'level' && b.count === newLevel);
      if (lvlAch) checkAchievementManually(lvlAch.id);
    } else {
      setXp(newXp);
    }
  };

  // ── achievements panelini aç/kapa (slide animasyonu) ──
  const openAchievementsPanel = () => {
    clickSes();
    setShowAchievements(true);
    slideAnim.setValue(height);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 55,
      useNativeDriver: true,
    }).start();
  };

  const closeAchievementsPanel = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setShowAchievements(false));
  };

  // ── Effects ──
  useEffect(() => {
    global.openAchievements = openAchievementsPanel;
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -10, duration: 2500, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0,   duration: 2500, useNativeDriver: true }),
    ])).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let multiplier = 2; 
      if (statsSpeed > 2) multiplier = 3.5; 
      const base = 0.01 * statsSpeed * multiplier;
      
      setTokluk(t => Math.max(0, t - base));
      setMutluluk(m => Math.max(0, m - base * 0.5));
      setTemizlik(tm => Math.max(0, tm - base * 0.7));
      setEnerji(e => Math.max(0, e - base * 0.8));
    }, 100);
    return () => clearInterval(timer);
  }, [statsSpeed]);

  useEffect(() => {
    ANIMAL_UNLOCK_LEVELS.forEach(a => {
      if (level >= a.level && !unlockedAnimals.includes(a.name)) {
        setUnlockedAnimals(prev => {
          const newList = [...prev, a.name];
          if (newList.length === 4) checkAchievementManually('hayvan_50');
          if (newList.length === 8) checkAchievementManually('hayvan_full');
          return newList;
        });
        if (a.name === 'Köpek') checkAchievementManually('kopek_sever');
      }
    });
  }, [level]);

  useEffect(() => {
    BASARIM_TANIMLARI.forEach(b => {
      if (unlocked.includes(b.id)) return;
      let condition = false;
      if (b.key === 'level') {
          condition = level >= b.count;
      } else if (b.key.startsWith('special_')) {
        if (b.key === 'special_overfed' && tokluk > 95 && lastAction.type === 'besle' && lastAction.count >= 10) condition = true;
        if (b.key === 'special_playful' && lastAction.type === 'oyun' && lastAction.count >= 20) condition = true;
        if (b.key === 'special_sleeper' && lastAction.type === 'uyku' && lastAction.count >= 10) condition = true;
      } else if (b.key.startsWith('animal_')) {
        const animalName = b.key.replace('animal_', '');
        condition = (animalActions[animalName] || 0) >= b.count;
      } else {
        condition = stats[b.key] >= b.count;
      }
      if (condition) {
        setUnlocked(prev => [...prev, b.id]);
        showAchievementNotif(b);
      }
    });
  }, [stats, lastAction, level, tokluk, animalActions]);

  const clickSes = () => playClickSound(isSoundEnabled);
  const hayvanSes = (eylem) => playAnimalSound(tur, eylem, isSoundEnabled);

  const handleAction = (type, fn) => {
    fn(); addXp(12);
    setLastAction(prev => {
      if (prev.type === type) return { type, count: prev.count + 1 };
      return { type, count: 1 };
    });
    // Aktif hayvana özel sayaç
    setAnimalActions(prev => ({
      ...prev,
      [tur]: (prev[tur] || 0) + 1,
    }));
  };

  const besleme = () => handleAction('besle', () => {
    clickSes(); hayvanSes('besleme');
    setTokluk(p => Math.min(100, p + 15));
    setTemizlik(p => Math.max(0, p - 5)); // Yemek yiyince kirlenir
    setStats(s => ({ ...s, besleme: s.besleme + 1 }));
    Animated.sequence([
      Animated.timing(bounceAnim, {toValue:1.2, duration:100, useNativeDriver:true}),
      Animated.spring(bounceAnim, {toValue:1, useNativeDriver:true})
    ]).start();
  });

  const oynama = () => handleAction('oyun', () => {
    clickSes(); hayvanSes('oynama');
    setMutluluk(p => Math.min(100, p + 20));
    setTemizlik(p => Math.max(0, p - 8));
    setEnerji(p => Math.max(0, p - 10)); 
    setTokluk(p => Math.max(0, p - 5));    
    setStats(s => ({ ...s, oyun: s.oyun + 1 }));
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue:10, duration:50, useNativeDriver:true}),
      Animated.timing(shakeAnim, {toValue:0, duration:50, useNativeDriver:true})
    ]).start();
  });

  const yikama = () => handleAction('yikama', () => {
    clickSes(); hayvanSes('yikama');
    setTemizlik(p => Math.min(100, p + 25));
    setStats(s => ({ ...s, yikama: s.yikama + 1 }));
  });

  const uyutma = () => handleAction('uyku', () => {
    clickSes(); hayvanSes('uyutma');
    setEnerji(p => Math.min(100, p + 30));
    setTokluk(p => Math.max(0, p - 8)); // Uyuyunca acıkır (Tokluk azalır)
    setStats(s => ({ ...s, uyku: s.uyku + 1 }));
    Animated.sequence([
      Animated.timing(sinkAnim, {toValue:10, duration:300, useNativeDriver:true}),
      Animated.timing(sinkAnim, {toValue:0, duration:300, useNativeDriver:true})
    ]).start();
  });

  // ── Render Helpers ──
  const accentColor = isDarkMode ? '#2D2438' : '#FFF5E1';
  const textColor = isDarkMode ? '#F5E6D3' : '#2D2438';

  return (
    <View style={styles.mainContainer}>
      {/* 🟢 XP Bar */}
      <View style={styles.xpBarContainer}>
        <View style={styles.levelBadge}><Text style={styles.levelText}>LVL {level}</Text></View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${(xp / (level * 100)) * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{xp} / {level * 100} XP</Text>
      </View>

      <Animated.View style={[styles.card, { backgroundColor: accentColor, opacity: fadeAnim }, !isDarkMode && styles.lightCard]}>
        <View style={styles.headerCentered}>
          <TouchableOpacity onPress={() => { setTempText(isim); setShowEditName(true); }}>
            <Text style={[styles.petNameCentered, { color: textColor }]}>{isim} ✎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.badgeCentered} onPress={() => setShowEditType(true)}>
            <Text style={[styles.badgeText, { color: textColor }]}>{tur} ▾</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.petArea, { transform: [{ scale: bounceAnim }, { translateX: shakeAnim }, { translateY: Animated.add(floatAnim, sinkAnim) }] }]}>
          <Text style={styles.petEmoji}>{getTurEmoji(tur)}</Text>
        </Animated.View>

        <View style={styles.statusSection}>
          <StatBar label="Tokluk"   value={tokluk}   emoji="🍖" color="#A8E6CF" textColor={textColor} />
          <StatBar label="Mutluluk" value={mutluluk} emoji="💝" color="#FFD3B6" textColor={textColor} />
          <StatBar label="Temizlik" value={temizlik} emoji="🧼" color="#A2D8E8" textColor={textColor} />
          <StatBar label="Enerji"   value={enerji}   emoji="⚡" color="#C8A2E8" textColor={textColor} />
        </View>

        <View style={styles.buttonGrid}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.feedButton]} onPress={besleme}><Text style={styles.buttonEmoji}>🍖</Text><Text style={[styles.buttonText, {color:textColor}]}>Besle</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.playButton]} onPress={oynama}><Text style={styles.buttonEmoji}>🎾</Text><Text style={[styles.buttonText, {color:textColor}]}>Oyna</Text></TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.washButton]} onPress={yikama}><Text style={styles.buttonEmoji}>🛁</Text><Text style={[styles.buttonText, {color:textColor}]}>Yıka</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.sleepButton]} onPress={uyutma}><Text style={styles.buttonEmoji}>😴</Text><Text style={[styles.buttonText, {color:textColor}]}>Uyut</Text></TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* İsim Modalı */}
      <Modal visible={showEditName} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditName(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>İsim Değiştir</Text>
            <TextInput
              style={styles.input}
              value={tempText}
              onChangeText={setTempText}
              placeholder="Yeni isim..."
              maxLength={20}
              autoFocus
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => { setIsim(tempText); setShowEditName(false); }}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Tür Modalı */}
      <Modal visible={showEditType} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditType(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tür Seç</Text>
            <View style={styles.typeGrid}>
              {ANIMAL_UNLOCK_LEVELS.map((a) => {
                const isLocked = !unlockedAnimals.includes(a.name);
                return (
                  <TouchableOpacity key={a.name} disabled={isLocked} style={[styles.typeOption, tur === a.name && styles.typeSelected, isLocked && {opacity:0.3}]} onPress={() => {setTur(a.name); setShowEditType(false);}}>
                    <Text style={styles.typeEmoji}>{isLocked ? '🔒' : getTurEmoji(a.name)}</Text>
                    <Text style={styles.typeText}>{a.name}</Text>
                    {isLocked && <Text style={{fontSize:8, color:'#FFF'}}>LVL {a.level}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Başarımlar Modalı - Smooth Slide-Up */}
      <Modal visible={showAchievements} transparent animationType="none">
        <View style={styles.modalOverlayFull}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeAchievementsPanel} />
          <Animated.View
            style={[
              styles.modalContentLarge,
              { backgroundColor: isDarkMode ? '#1A1A2E' : '#F5E6D3' },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Sürükleme Çubuğu */}
            <View style={styles.dragHandle} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleLarge, { color: textColor }]}>🏆 Başarımlar</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeAchievementsPanel}>
                <Text style={[styles.closeButtonText, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.achScroll} contentContainerStyle={styles.achScrollContent}>
              {BASARIM_TANIMLARI.map(b => {
                const isUnlocked = unlocked.includes(b.id);
                let current = 0;
                if (b.key === 'level') current = level;
                else if (b.key.startsWith('animal_')) current = animalActions[b.key.replace('animal_', '')] || 0;
                else current = stats[b.key] || 0;
                const progress = Math.min(100, (current / b.count) * 100) || 0;

                return (
                  <View key={b.id} style={[styles.achievementRow, !isUnlocked && {opacity:0.45}]}>
                    <View style={[styles.achIconContainer, isUnlocked && styles.achIconUnlocked]}>
                      <Text style={{fontSize:28}}>{isUnlocked ? b.icon : '🔒'}</Text>
                    </View>
                    <View style={{flex:1, marginLeft:15}}>
                      <Text style={[styles.achievementTitle, { color: textColor }]}>{b.title}</Text>
                      <Text style={[styles.achievementDesc, { color: textColor, opacity: 0.6 }]}>{b.desc}</Text>
                      <View style={styles.achProgressBack}>
                        <View style={[styles.achProgressFill, {width: `${isUnlocked ? 100 : progress}%`}]} />
                      </View>
                      {!isUnlocked && (
                        <Text style={[styles.achCounter, { color: textColor }]}>{current} / {b.count}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 0,
  },
  xpBarContainer: {
    width: width * 0.92,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 162, 232, 0.4)',
  },
  levelBadge: {
    backgroundColor: '#C8A2E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  levelText: {
    color: '#1A1A2E',
    fontSize: 13,
    fontWeight: '900',
  },
  xpTrack: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#A8E6CF',
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 10,
  },
  card: {
    width: width * 0.92,
    borderRadius: 35,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  lightCard: {
    shadowColor: '#A67C52',
    shadowOpacity: 0.2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerCentered: {
    alignItems: 'center',
    marginBottom: 10,
  },
  petNameCentered: {
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 1.5,
  },
  badgeCentered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 5,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },
  petArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  petEmoji: { fontSize: 90 },
  statusSection: {
    width: '100%',
    marginBottom: 15,
  },
  statContainer: {
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 12,
  },
  statBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  buttonGrid: {
    width: '100%',
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.8,
  },
  feedButton: { backgroundColor: 'rgba(168,230,207,0.18)', borderColor: 'rgba(168,230,207,0.45)' },
  playButton: { backgroundColor: 'rgba(255,211,182,0.18)', borderColor: 'rgba(255,211,182,0.45)' },
  washButton: { backgroundColor: 'rgba(162,216,232,0.18)', borderColor: 'rgba(162,216,232,0.45)' },
  sleepButton: { backgroundColor: 'rgba(200,162,232,0.18)', borderColor: 'rgba(200,162,232,0.45)' },
  buttonEmoji: { fontSize: 24 },
  buttonText: { fontSize: 16, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayFull: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  dragHandle: {
    width: 45,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 18,
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#2A2D3E',
    borderRadius: 35,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalContentLarge: {
    width: '100%',
    height: height * 0.88,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitleLarge: {
    fontSize: 26,
    fontWeight: '900',
  },
  closeButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
  },
  closeButtonText: { fontSize: 22, fontWeight: 'bold' },
  achScroll: { width: '100%', flex: 1 },
  achScrollContent: { paddingBottom: 50 },
  achievementRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  achIconContainer: {
    width: 65,
    height: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTitle: { fontSize: 19, fontWeight: '900', marginBottom: 3 },
  achievementDesc: { fontSize: 12, marginBottom: 10 },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 18,
    color: '#FFF',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  saveButton: {
    backgroundColor: '#C8A2E8',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 18,
  },
  saveButtonText: { color: '#1A1A2E', fontWeight: '900', fontSize: 17 },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  typeOption: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  typeSelected: { borderColor: '#C8A2E8', backgroundColor: 'rgba(200,162,232,0.15)' },
  typeEmoji: { fontSize: 36 },
  typeText: { fontSize: 11, color: '#FFF', marginTop: 5, fontWeight: '800' },
  achProgressBack: { height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' },
  achProgressFill: { height: '100%', backgroundColor: '#A8E6CF' },
  achIconUnlocked: {
    backgroundColor: 'rgba(200,162,232,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(200,162,232,0.5)',
  },
  achCounter: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.5,
    marginTop: 4,
  },
});

export default DigitalPet;
