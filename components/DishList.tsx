import React from 'react';
import { FlatList, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import DishItem from './DishItem';

interface Props {
  dishes: Dish[];
}

const DishList: React.FC<Props> = ({ dishes }) => {
  return (
    <FlatList
      style={{ width: '100%', backgroundColor: Colors[useColorScheme() ?? 'light']['background']}}
      data={dishes}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <DishItem dish={item} />}
    />
  );
};

export default DishList;
