import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // ── Dot bounces (staggered appear)
  const dot1Bounce = useRef(new Animated.Value(0)).current;
  const dot2Bounce = useRef(new Animated.Value(0)).current;
  const dot3Bounce = useRef(new Animated.Value(0)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  // ── Merge: left & right dots slide to center
  const dot1X = useRef(new Animated.Value(0)).current;
  const dot3X = useRef(new Animated.Value(0)).current;
  const dot1MergeOp = useRef(new Animated.Value(1)).current;
  const dot3MergeOp = useRef(new Animated.Value(1)).current;

  // ── Center dot fade out before paw appears
  const dot2MergeOp = useRef(new Animated.Value(1)).current;

  // ── Paw emoji scale & opacity
  const pawScale = useRef(new Animated.Value(0.3)).current;
  const pawOpacity = useRef(new Animated.Value(0)).current;

  // ── Final Fade Out instead of slide
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const bounceDot = (anim) =>
    Animated.sequence([
      Animated.timing(anim, { toValue: -18, duration: 250, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(anim, { toValue: 0,   duration: 200, useNativeDriver: true, easing: Easing.bounce }),
    ]);

  useEffect(() => {
    Animated.sequence([
      // ── 1. Dots appear & bounce sequence
      Animated.parallel([
        Animated.timing(dot1Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        bounceDot(dot1Bounce),
      ]),
      Animated.parallel([
        Animated.timing(dot2Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        bounceDot(dot2Bounce),
      ]),
      Animated.parallel([
        Animated.timing(dot3Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        bounceDot(dot3Bounce),
      ]),

      Animated.delay(300),

      // ── 2. Dots merge to center
      Animated.parallel([
        Animated.timing(dot1X,       { toValue: 46, duration: 400, useNativeDriver: true, easing: Easing.inOut(Easing.cubic) }),
        Animated.timing(dot3X,       { toValue: -46, duration: 400, useNativeDriver: true, easing: Easing.inOut(Easing.cubic) }),
        Animated.timing(dot1MergeOp, { toValue: 0,  duration: 400, useNativeDriver: true }),
        Animated.timing(dot3MergeOp, { toValue: 0,  duration: 400, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(250),
          Animated.timing(dot2MergeOp, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]),
      ]),

      // ── 3. Paw emoji appears
      Animated.parallel([
        Animated.spring(pawScale,   { toValue: 1.5, friction: 5, tension: 70, useNativeDriver: true }),
        Animated.timing(pawOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),

      Animated.delay(400),

      // ── 4. Paw Grows MUCH BIGGER
      Animated.timing(pawScale, {
        toValue: 3.5, // Daha büyük pati
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),

      Animated.delay(200),

      // ── 5. FADE OUT THE WHOLE THING
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: containerOpacity },
      ]}
      pointerEvents="none"
    >
      <View style={styles.content}>
        {/* 3 Dots */}
        <View style={styles.dotsRow}>
          <Animated.Text
            style={[
              styles.dot,
              {
                opacity: Animated.multiply(dot1Opacity, dot1MergeOp),
                transform: [{ translateY: dot1Bounce }, { translateX: dot1X }],
              },
            ]}
          >
            ●
          </Animated.Text>

          <Animated.Text
            style={[
              styles.dot,
              {
                opacity: Animated.multiply(dot2Opacity, dot2MergeOp),
                transform: [{ translateY: dot2Bounce }],
              },
            ]}
          >
            ●
          </Animated.Text>

          <Animated.Text
            style={[
              styles.dot,
              {
                opacity: Animated.multiply(dot3Opacity, dot3MergeOp),
                transform: [{ translateY: dot3Bounce }, { translateX: dot3X }],
              },
            ]}
          >
            ●
          </Animated.Text>
        </View>

        {/* Paw Emoji */}
        <Animated.Text
          style={[
            styles.paw,
            {
              opacity: pawOpacity,
              transform: [{ scale: pawScale }],
            },
          ]}
        >
          🐾
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    backgroundColor: '#1A1A2E',
    zIndex: 9999999, // Ekstrem yüksek zIndex
    elevation: 9999999, // Android için uç değer elevation
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    position: 'absolute',
  },
  dot: {
    fontSize: 22,
    color: '#C8A2E8',
  },
  paw: {
    fontSize: 80,
    position: 'absolute',
  },
});

export default SplashScreen;
