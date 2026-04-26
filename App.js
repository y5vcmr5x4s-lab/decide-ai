import { StatusBar } from 'expo-status-bar';
import { RotateCcw, Sparkles } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';

const processAI = async (question) => {
  try {
    const response = await fetch('https://decide-ai-zeta.vercel.app/api/decide', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    return data.answer;
  } catch {
    return 'Vesmír mlčí. Zkus to znovu za chvíli.';
  }
};

export default function App() {
  const [question, setQuestion] = useState('');
  const [decision, setDecision] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);

  const answerOpacity = useRef(new Animated.Value(0)).current;
  const answerTranslateY = useRef(new Animated.Value(24)).current;
  const answerSpacing = useRef(new Animated.Value(0)).current;
  const titleBreath = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const historySlide = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);
  const breathLoopRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (breathLoopRef.current) {
        breathLoopRef.current.stop();
      }
    },
    []
  );

  useEffect(() => {
    Animated.timing(historySlide, {
      toValue: historyVisible ? 1 : 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [historySlide, historyVisible]);

  const startTitleBreath = useCallback(() => {
    titleBreath.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(titleBreath, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(titleBreath, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    );
    breathLoopRef.current = loop;
    loop.start();
  }, [titleBreath]);

  const stopTitleBreath = useCallback(() => {
    if (breathLoopRef.current) {
      breathLoopRef.current.stop();
      breathLoopRef.current = null;
    }
    titleBreath.setValue(0);
  }, [titleBreath]);

  const runAnswerEntrance = useCallback(() => {
    answerOpacity.setValue(0);
    answerTranslateY.setValue(24);
    answerSpacing.setValue(0);

    Animated.parallel([
      Animated.timing(answerOpacity, { toValue: 1, duration: 820, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(answerTranslateY, { toValue: 0, duration: 820, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(answerSpacing, { toValue: 1.2, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(answerSpacing, { toValue: 0.35, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
    ]).start();
  }, [answerOpacity, answerSpacing, answerTranslateY]);

  const handleDecide = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setDecision('');
    startTitleBreath();

    timeoutRef.current = setTimeout(async () => {
      const output = await processAI(trimmed);
      setDecision(output);
      setHistory((prev) => [{ question: trimmed, answer: output }, ...prev].slice(0, 5));
      setIsAnalyzing(false);
      stopTitleBreath();
      runAnswerEntrance();
    }, 3000);
  }, [isAnalyzing, question, runAnswerEntrance, startTitleBreath, stopTitleBreath]);

  const handleReset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopTitleBreath();
    setQuestion('');
    setDecision('');
    setIsAnalyzing(false);
    answerOpacity.setValue(0);
    answerTranslateY.setValue(24);
    answerSpacing.setValue(0);
  }, [answerOpacity, answerSpacing, answerTranslateY, stopTitleBreath]);

  const toggleHistory = useCallback(() => {
    setHistoryVisible((prev) => !prev);
  }, []);

  const isQuestionReady = question.trim().length > 0 && !isAnalyzing;

  return (
    <SafeAreaView className="flex-1 bg-black" style={{ backgroundColor: '#000000' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: '#000000' }}>
          <View className="absolute inset-0" style={{ backgroundColor: '#050505' }} />
          <View className="absolute" style={{ width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(31, 58, 147, 0.16)', top: -70, left: -40 }} />
          <View className="absolute" style={{ width: 340, height: 340, borderRadius: 170, backgroundColor: 'rgba(76, 29, 149, 0.14)', bottom: -100, right: -40 }} />

          <View className="w-full" style={{ maxWidth: 520 }}>
            <Animated.Text
              className="mb-10 text-center text-5xl tracking-[0.2em]"
              style={{
                color: 'white',
                fontWeight: '300',
                opacity: titleBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] }),
                textShadowColor: '#4FD1C5',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: titleBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 10] }),
              }}
            >
              Decide.ai
            </Animated.Text>

            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="Co dnes opravdu potřebuješ rozhodnout?"
              placeholderTextColor="#4B4B4B"
              className="w-full text-center text-3xl"
              style={{ color: 'white', fontWeight: '300', minHeight: 68 }}
              caretHidden={false}
              selectionColor="#8B8B8B"
            />
            <View className="mt-2 h-px w-full" style={{ backgroundColor: '#333333' }} />

            <View className="mt-12 items-center">
              {isAnalyzing ? (
                <View className="items-center">
                  <Animated.View
                    className="h-20 w-20 rounded-full"
                    style={{
                      borderWidth: 1,
                      borderColor: '#2A2A2A',
                      transform: [{ scale: titleBreath.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.08] }) }],
                    }}
                  />
                </View>
              ) : (
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <Pressable
                    onPressIn={() => Animated.spring(buttonScale, { toValue: 1.06, speed: 18, bounciness: 4, useNativeDriver: true }).start()}
                    onPressOut={() => Animated.spring(buttonScale, { toValue: 1, speed: 18, bounciness: 4, useNativeDriver: true }).start()}
                    onPress={handleDecide}
                    disabled={!isQuestionReady}
                    className="h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: '#0E0E0E',
                      borderWidth: 1,
                      borderColor: '#2A2A2A',
                      shadowColor: '#5EEAD4',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isQuestionReady ? 0.22 : 0.08,
                      shadowRadius: 14,
                    }}
                  >
                    <View className="absolute inset-2 rounded-full" style={{ borderWidth: 1, borderColor: '#2A2A2A', opacity: 0.5 }} />
                    <Sparkles size={22} color="#FFFFFF" strokeWidth={2.2} />
                    <Text className="mt-2 text-xl tracking-[0.16em]" style={{ color: 'white', fontWeight: '300' }}>
                      DECIDE
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>

            {decision ? (
              <View className="mt-10 overflow-hidden rounded-3xl bg-white/5" style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}>
                <Animated.View className="px-6 py-7" style={{ opacity: answerOpacity, transform: [{ translateY: answerTranslateY }] }}>
                  <Animated.Text
                    className="text-center text-3xl leading-[44px]"
                    style={{
                      color: 'white',
                      fontWeight: '300',
                      letterSpacing: answerSpacing,
                      textShadowColor: '#4FD1C5',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }}
                  >
                    {decision}
                  </Animated.Text>

                  <Pressable onPress={handleReset} className="mt-6 flex-row items-center justify-center">
                    <RotateCcw size={14} color="#FFFFFF" />
                    <Text className="ml-2 text-xs tracking-[0.12em]" style={{ color: 'white' }}>
                      ZKUSIT ZNOVU
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>
            ) : null}
          </View>

          <View className="absolute bottom-8 w-full px-8" style={{ maxWidth: 560 }}>
            <View className="items-center">
              <Pressable onPress={toggleHistory} className="rounded-full px-3 py-2">
                <Text style={{ color: 'white', opacity: 0.45 }}>◷</Text>
              </Pressable>
            </View>
            <Animated.View
              style={{
                opacity: historySlide,
                transform: [{ translateY: historySlide.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
              }}
            >
              {historyVisible ? (
                <View className="mt-3 overflow-hidden rounded-2xl bg-white/5" style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}>
                  <View className="px-4 py-3">
                    {history.slice(0, 3).map((entry, index) => (
                      <Text key={`${entry.question}-${index}`} className="mb-1 text-[11px] leading-4" style={{ color: 'white', opacity: 0.45 }}>
                        {entry.question} - {entry.answer}
                      </Text>
                    ))}
                    {history.length === 0 ? (
                      <Text className="text-[11px]" style={{ color: 'white', opacity: 0.45 }}>
                        Zatím žádné záznamy.
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
