import React from "react";
import { View, Text } from "react-native";

interface Props {
  dish: Dish;
}

const DishItem: React.FC<Props> = ({ dish }) => {
  return (
    <View>
      <Text>{dish.name}</Text>
      <Text>Tags comming soon</Text>
    </View>
  );
};

export default DishItem;
