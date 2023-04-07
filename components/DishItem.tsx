import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { ListItem } from "@rneui/themed";

import Colors from '../constants/Colors';

interface Props {
  dish: Dish;
}

const DishItem: React.FC<Props> = ({ dish }) => {
  return (
    <ListItem containerStyle={{backgroundColor: Colors[useColorScheme() ?? 'light']['background']}} bottomDivider={true}>
      <ListItem.Content style={{backgroundColor: Colors[useColorScheme() ?? 'light']['background']}}>
        <ListItem.Title style={{color: Colors[useColorScheme() ?? 'light']['text']}}>{dish.name}</ListItem.Title>
        <ListItem.Subtitle style={{color: Colors[useColorScheme() ?? 'light']['text']}}>{dish.tags.join()}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default DishItem;
