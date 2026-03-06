import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { COLORS } from '../../shared/constants/theme';

const StudyScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userText, setUserText] = useState('');
  const [comparison, setComparison] = useState(null);

  const currentCard = cards[currentIndex];

  const handleSpeak = () => {
    Speech.speak(currentCard.pregunta, { language: 'es' });
  };

  const checkDictado = () => {
    const original = currentCard.pregunta.toLowerCase().trim().split(/\s+/);
    const typed = userText.toLowerCase().trim().split(/\s+/);
    
    const parts = typed.map((word, i) => ({
      text: word,
      correct: word === original[i]
    }));

    const score = Math.round((parts.filter(p => p.correct).length / original.length) * 100);
    setComparison({ score, parts });
  };

  if (!currentCard) return <View style={styles.container}><Text>Cargando...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {!isFlipped ? (
          <View>
            {/* TIPO IMAGEN */}
            {currentCard.tipo === 'imagen' && (
              <Image source={{ uri: currentCard.imagen_url }} style={styles.image} />
            )}

            {/* TIPO NARRADO */}
            {currentCard.tipo === 'narrado' && (
              <View style={styles.dictadoBox}>
                <TouchableOpacity onPress={handleSpeak} style={styles.btnAudio}>
                  <Text style={{fontSize: 30}}>🔊</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe lo que escuchas..."
                  value={userText}
                  onChangeText={setUserText}
                />
                <TouchableOpacity onPress={checkDictado} style={styles.btnValidar}>
                  <Text style={{color: 'white'}}>VALIDAR</Text>
                </TouchableOpacity>

                {comparison && (
                  <View style={styles.resultBox}>
                    <Text>
                      {comparison.parts.map((p, i) => (
                        <Text key={i} style={{ color: p.correct ? 'green' : 'red', fontWeight: 'bold' }}>
                          {p.text}{' '}
                        </Text>
                      ))}
                    </Text>
                    <Text style={{fontWeight: 'bold', marginTop: 10}}>Acierto: {comparison.score}%</Text>
                  </View>
                )}
              </View>
            )}

            {currentCard.tipo === 'texto' && <Text style={styles.textoPregunta}>{currentCard.pregunta}</Text>}

            <TouchableOpacity style={styles.btnFlip} onPress={() => setIsFlipped(true)}>
              <Text>REVELAR RESPUESTA</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.backFace}>
            <Text style={styles.label}>Respuesta Correcta:</Text>
            <Text style={styles.textoRespuesta}>{currentCard.respuesta}</Text>
            <View style={styles.row}>
                {/* Botones de calificación... */}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  card: { width: '100%', minHeight: 400, backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, marginVertical: 15 },
  btnAudio: { alignSelf: 'center', backgroundColor: '#e3f2fd', padding: 15, borderRadius: 50 },
  btnValidar: { backgroundColor: COLORS.PRIMARY, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnFlip: { marginTop: 30, padding: 15, backgroundColor: '#eee', borderRadius: 10, alignItems: 'center' },
  resultBox: { marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 }
});

export default StudyScreen;