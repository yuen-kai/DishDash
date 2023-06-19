import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSavedDishes(): Promise<Dish[]> {
  const savedDishesString = await AsyncStorage.getItem("savedDishes");

  if (savedDishesString === null) {
    return [
      {
        id: 1,
        name: "Pizza",
        tags: ["Tag1", "Tag2", "Tag3"],
        lastEaten: 1,
        rating: 3,
      },
      {
        id: 2,
        name: "Burger",
        tags: ["Tag1", "Tag2", "Tag3"],
        lastEaten: 1,
        rating: 3,
      },
      {
        id: 3,
        name: "Pasta",
        tags: ["Tag1", "Tag2", "Tag3"],
        lastEaten: 1,
        rating: 3,
      },
    ];
  }

  const savedDishes = JSON.parse(savedDishesString);

  return savedDishes;
}
