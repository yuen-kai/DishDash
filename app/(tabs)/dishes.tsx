import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import DishList from "../../components/DishList";
import { getSavedDishes } from "../SavedDishes";
import { FAB } from "@rneui/themed";

let dishes: Dish[] = [
  { id: 1, name: "Pizza", tags: ["Tag1", "Tag2", "Tag3"], lastEaten: 1 },
  { id: 2, name: "Burger", tags: ["Tag1", "Tag2", "Tag3"], lastEaten: 1 },
  { id: 3, name: "Pasta", tags: ["Tag1", "Tag2", "Tag3"], lastEaten: 1 },
];

export default function TabTwoScreen() {
  // async function doSomethingWithSavedDishes() {
  //   dishes = await getSavedDishes();
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dishes</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <DishList dishes={dishes} />
      <FAB
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color="blue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
