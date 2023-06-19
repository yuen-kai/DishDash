import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { ListItem } from "@rneui/themed";

import Colors from '../constants/Colors';

interface Props {
  dish: Dish;
}

const DishItem: React.FC<Props> = ({ dish }) => {
  const colorScheme = useColorScheme();

  return (
    <ListItem containerStyle={{backgroundColor: Colors[colorScheme ?? 'light']['background']}} bottomDivider={true}>
      <ListItem.Content style={{backgroundColor: Colors[colorScheme ?? 'light']['background']}}>
        <ListItem.Title style={{color: Colors[colorScheme ?? 'light']['text']}}>{dish.name}</ListItem.Title>
        <ListItem.Subtitle style={{color: Colors[colorScheme ?? 'light']['text']}}>{dish.tags.join()}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default DishItem;
