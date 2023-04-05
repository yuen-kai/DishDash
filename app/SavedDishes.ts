import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSavedDishes(): Promise<Dish[]> {
  const savedDishesString = await AsyncStorage.getItem('savedDishes');

  if (savedDishesString === null) {
    return [
        { id: 1, name: 'Pizza', tags: [''], lastEaten: 1 },
        { id: 2, name: 'Burger', tags: [''], lastEaten: 1},
        { id: 3, name: 'Pasta', tags: [''], lastEaten: 1},
      ];
  }

  const savedDishes = JSON.parse(savedDishesString);

  return savedDishes;
}
