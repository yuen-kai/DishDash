import React from 'react';
import { FlatList } from 'react-native';
import DishItem from './DishItem';

interface Props {
  dishes: Dish[];
}

const DishList: React.FC<Props> = ({ dishes }) => {
  return (
    <FlatList
      data={dishes}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <DishItem dish={item} />}
    />
  );
};

export default DishList;
