import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Block, Text, Button, theme } from 'galio-framework';
import { useAuth } from '../../context/AuthContext';
import { getMyCourses } from '../../api/courseService'; // Asegúrate de tener este servicio
import { COLORS } from '../../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const data = await getMyCourses();
        setCourses(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  // Función para "Jalar y refrescar"
  const onRefresh = () => {
      setRefreshing(true);
      loadData();
  };

  // Renderizado de cada tarjeta de curso
  const renderCourseItem = ({ item }) => (
    <Block card style={styles.card}>
        <Block row space="between" style={{ marginBottom: 10 }}>
            <Block flex>
                <Text h6 bold color={COLORS.TEXT}>{item.nombre_curso}</Text>
                <Text size={12} color={COLORS.MUTED} style={{ marginTop: 5 }}>
                    {item.descripcion || 'Curso asignado'}
                </Text>
            </Block>
            <Text size={20}>📚</Text>
        </Block>

        <Button 
            color={COLORS.PRIMARY} 
            round 
            size="small" 
            style={{ width: '100%', marginTop: 10 }}
            onPress={() => navigation.navigate('CourseDecks', { courseId: item.id_curso })}
        >
            VER CONTENIDO
        </Button>
    </Block>
  );

  return (
    <Block flex style={styles.container}>
      
      {/* Título de la sección */}
      <Block style={{ marginBottom: 15 }}>
        <Text h5 color={COLORS.SECONDARY} bold>
          Mis Cursos
        </Text>
        <Text size={12} color={COLORS.MUTED}>
            Selecciona un curso para empezar a estudiar
        </Text>
      </Block>

      {loading ? (
          <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{ marginTop: 50 }} />
      ) : (
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id_curso.toString()}
            renderItem={renderCourseItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            
            // Pull to refresh
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            
            // Mensaje si está vacío
            ListEmptyComponent={
                <Block middle style={{ marginTop: 50 }}>
                    <Text muted>No tienes cursos asignados.</Text>
                </Block>
            }
            
            // Botón de Logout al final de la lista
            ListFooterComponent={
                <TouchableOpacity onPress={signOut} style={{ marginTop: 30, alignSelf: 'center', padding: 10 }}>
                    <Text color={COLORS.ERROR} bold>Cerrar Sesión</Text>
                </TouchableOpacity>
            }
          />
      )}
    </Block>
  );
};

const styles = {
  container: {
      padding: 20,
      backgroundColor: '#F4F6F8' // Fondo gris suave
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    // Sombras nativas
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.PRIMARY
  }
};

export default DashboardScreen;