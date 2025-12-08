import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Block, Text, Button, theme } from 'galio-framework';
import { getDecksByCourse } from '../../api/courseService';
import { COLORS } from '../../constants/theme';
import DeckItemWithProgress from '../ui/DeckItemWithProgress';
const CourseDecksScreen = ({ route, navigation }) => {
  const { courseId } = route.params; // Recibe ID de React Navigation
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        const data = await getDecksByCourse(courseId);
        setDecks(data);
    };
    loadData();
  }, []);

  return (
    <Block flex style={{ padding: 20 }}>
      <Text h5 bold style={{ marginBottom: 20 }}>Decks del Curso</Text>
      
      <FlatList 
        data={decks}
        keyExtractor={item => item.id_deck.toString()}
        renderItem={({ item }) => (
            <DeckItemWithProgress 
                deck={item} 
                onStudy={(id) => navigation.navigate('Study', { deckId: id })} 
            />
        )}
      />
    </Block>
  );
};

const styles = {
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, elevation: 2 }
};

export default CourseDecksScreen;