import { Audio } from 'expo-av';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 SES DOSYASI KAYIT DEFTERİ
//
// Nasıl kullanılır?
// 1. assets/sounds/ klasörüne ses dosyanızı ekleyin (örn: kedi_1.mp3)
// 2. Aşağıdaki ilgili satırın başındaki "//" işaretini kaldırın
// 3. Uygulamayı yeniden başlatın — ses anında çalışmaya başlar!
//
// Dosya adı şablonu:  {tur}_{eylem}.mp3  veya  {tur}_{numara}.mp3
// ═══════════════════════════════════════════════════════════════════════════
const SES_KAYIT_DEFTERI = {

  // ── UI Sesi ──────────────────────────────────────────────────────────────
  // ui_click:         require('../assets/sounds/ui_click.mp3'),

  // ── Kedi ─────────────────────────────────────────────────────────────────
  // kedi_idle_1:      require('../assets/sounds/kedi_1.mp3'),
  // kedi_idle_2:      require('../assets/sounds/kedi_2.mp3'),
  // kedi_besleme:     require('../assets/sounds/kedi_besleme.mp3'),
  // kedi_oynama:      require('../assets/sounds/kedi_oyun.mp3'),
  // kedi_yikama:      require('../assets/sounds/kedi_yikama.mp3'),
  // kedi_uyutma:      require('../assets/sounds/kedi_uyku.mp3'),

  // ── Köpek ────────────────────────────────────────────────────────────────
  // kopek_idle_1:     require('../assets/sounds/kopek_1.mp3'),
  // kopek_idle_2:     require('../assets/sounds/kopek_2.mp3'),
  // kopek_besleme:    require('../assets/sounds/kopek_besleme.mp3'),
  // kopek_oynama:     require('../assets/sounds/kopek_oyun.mp3'),
  // kopek_yikama:     require('../assets/sounds/kopek_yikama.mp3'),
  // kopek_uyutma:     require('../assets/sounds/kopek_uyku.mp3'),

  // ── Tavşan ───────────────────────────────────────────────────────────────
  // tavsan_idle_1:    require('../assets/sounds/tavsan_1.mp3'),
  // tavsan_besleme:   require('../assets/sounds/tavsan_besleme.mp3'),
  // tavsan_oynama:    require('../assets/sounds/tavsan_oyun.mp3'),
  // tavsan_yikama:    require('../assets/sounds/tavsan_yikama.mp3'),
  // tavsan_uyutma:    require('../assets/sounds/tavsan_uyku.mp3'),

  // ── Kuş ──────────────────────────────────────────────────────────────────
  // kus_idle_1:       require('../assets/sounds/kus_1.mp3'),
  // kus_idle_2:       require('../assets/sounds/kus_2.mp3'),
  // kus_besleme:      require('../assets/sounds/kus_besleme.mp3'),
  // kus_oynama:       require('../assets/sounds/kus_oyun.mp3'),
  // kus_yikama:       require('../assets/sounds/kus_yikama.mp3'),
  // kus_uyutma:       require('../assets/sounds/kus_uyku.mp3'),

  // ── Hamster ──────────────────────────────────────────────────────────────
  // hamster_idle_1:   require('../assets/sounds/hamster_1.mp3'),
  // hamster_besleme:  require('../assets/sounds/hamster_besleme.mp3'),
  // hamster_oynama:   require('../assets/sounds/hamster_oyun.mp3'),
  // hamster_yikama:   require('../assets/sounds/hamster_yikama.mp3'),
  // hamster_uyutma:   require('../assets/sounds/hamster_uyku.mp3'),

  // ── Balık ────────────────────────────────────────────────────────────────
  // balik_idle_1:     require('../assets/sounds/balik_1.mp3'),
  // balik_besleme:    require('../assets/sounds/balik_besleme.mp3'),
  // balik_oynama:     require('../assets/sounds/balik_oyun.mp3'),
  // balik_yikama:     require('../assets/sounds/balik_yikama.mp3'),
  // balik_uyutma:     require('../assets/sounds/balik_uyku.mp3'),

  // ── Ejderha ──────────────────────────────────────────────────────────────
  // ejderha_idle_1:   require('../assets/sounds/ejderha_1.mp3'),
  // ejderha_idle_2:   require('../assets/sounds/ejderha_2.mp3'),
  // ejderha_besleme:  require('../assets/sounds/ejderha_besleme.mp3'),
  // ejderha_oynama:   require('../assets/sounds/ejderha_oyun.mp3'),
  // ejderha_yikama:   require('../assets/sounds/ejderha_yikama.mp3'),
  // ejderha_uyutma:   require('../assets/sounds/ejderha_uyku.mp3'),

  // ── Unicorn ──────────────────────────────────────────────────────────────
  // unicorn_idle_1:   require('../assets/sounds/unicorn_1.mp3'),
  // unicorn_besleme:  require('../assets/sounds/unicorn_besleme.mp3'),
  // unicorn_oynama:   require('../assets/sounds/unicorn_oyun.mp3'),
  // unicorn_yikama:   require('../assets/sounds/unicorn_yikama.mp3'),
  // unicorn_uyutma:   require('../assets/sounds/unicorn_uyku.mp3'),
};

// ═══════════════════════════════════════════════════════════════════════════
// TÜR + EYLEM → KAYIT DEFTERİ ANAHTARLARI HARİTASI
// Bu haritayı değiştirmenize gerek yok.
// ═══════════════════════════════════════════════════════════════════════════
const TUR_EYLEM_ANAHTARLARI = {
  Kedi:    { idle: ['kedi_idle_1', 'kedi_idle_2'], besleme: ['kedi_besleme'], oynama: ['kedi_oynama'], yikama: ['kedi_yikama'], uyutma: ['kedi_uyutma'] },
  Köpek:   { idle: ['kopek_idle_1', 'kopek_idle_2'], besleme: ['kopek_besleme'], oynama: ['kopek_oynama'], yikama: ['kopek_yikama'], uyutma: ['kopek_uyutma'] },
  Tavşan:  { idle: ['tavsan_idle_1'], besleme: ['tavsan_besleme'], oynama: ['tavsan_oynama'], yikama: ['tavsan_yikama'], uyutma: ['tavsan_uyutma'] },
  Kuş:     { idle: ['kus_idle_1', 'kus_idle_2'], besleme: ['kus_besleme'], oynama: ['kus_oynama'], yikama: ['kus_yikama'], uyutma: ['kus_uyutma'] },
  Hamster: { idle: ['hamster_idle_1'], besleme: ['hamster_besleme'], oynama: ['hamster_oynama'], yikama: ['hamster_yikama'], uyutma: ['hamster_uyutma'] },
  Balık:   { idle: ['balik_idle_1'], besleme: ['balik_besleme'], oynama: ['balik_oynama'], yikama: ['balik_yikama'], uyutma: ['balik_uyutma'] },
  Ejderha: { idle: ['ejderha_idle_1', 'ejderha_idle_2'], besleme: ['ejderha_besleme'], oynama: ['ejderha_oynama'], yikama: ['ejderha_yikama'], uyutma: ['ejderha_uyutma'] },
  Unicorn: { idle: ['unicorn_idle_1'], besleme: ['unicorn_besleme'], oynama: ['unicorn_oynama'], yikama: ['unicorn_yikama'], uyutma: ['unicorn_uyutma'] },
};

// ─────────────────────────────────────────────────────────────
// Yardımcı: Dizi içinden rastgele eleman seçer
// ─────────────────────────────────────────────────────────────
const rastgeleEleman = (dizi) => dizi[Math.floor(Math.random() * dizi.length)];

// ─────────────────────────────────────────────────────────────
// Ses çalma motoru — hata olursa sessizce devam eder
// ─────────────────────────────────────────────────────────────
const sesMotoru = async (sesKaynagi) => {
  if (!sesKaynagi) return;
  try {
    const { sound } = await Audio.Sound.createAsync(sesKaynagi);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (_) {
    // Sessiz hata — ses dosyası eklendikten sonra otomatik çalışır
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

// Seslerin sırasını takip etmek için index tutucu
const SES_SIRA_TAKIP = {};

/**
 * Hayvanın türüne ve eylemine göre ses çalar.
 * @param {string} tur 
 * @param {string} eylem 
 * @param {boolean} sesAcik 
 * @param {boolean} sirali - True ise sesleri sırayla çalar, false ise rastgele.
 */
export const playAnimalSound = async (tur, eylem, sesAcik, sirali = false) => {
  if (!sesAcik) return;

  const turHaritasi = TUR_EYLEM_ANAHTARLARI[tur];
  if (!turHaritasi) return;

  const anahtarlar = turHaritasi[eylem] ?? turHaritasi.idle ?? [];
  const mevcutSesler = anahtarlar
    .map((k) => SES_KAYIT_DEFTERI[k])
    .filter(Boolean);

  if (mevcutSesler.length === 0) return;

  let seciliSes;
  const takipKey = `${tur}_${eylem}`;

  if (sirali) {
    if (SES_SIRA_TAKIP[takipKey] === undefined) SES_SIRA_TAKIP[takipKey] = 0;
    seciliSes = mevcutSesler[SES_SIRA_TAKIP[takipKey]];
    SES_SIRA_TAKIP[takipKey] = (SES_SIRA_TAKIP[takipKey] + 1) % mevcutSesler.length;
  } else {
    seciliSes = rastgeleEleman(mevcutSesler);
  }

  await sesMotoru(seciliSes);
};

/**
 * Chibi UI tıklama sesi — tüm butonlara otomatik bağlanır.
 * assets/sounds/ui_click.mp3 dosyasını ekleyip üstteki satırı açmanız yeterli.
 * @param {boolean} sesAcik  Genel ses ayarı
 */
export const playClickSound = async (sesAcik) => {
  if (!sesAcik) return;
  await sesMotoru(SES_KAYIT_DEFTERI['ui_click']);
};
