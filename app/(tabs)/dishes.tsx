import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import DishList from '../../components/DishList';
import { getSavedDishes } from '../SavedDishes';

let dishes: Dish[] = [];

export default function TabTwoScreen() {
  async function doSomethingWithSavedDishes() {
    dishes = await getSavedDishes();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dishes</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <DishList dishes={dishes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
