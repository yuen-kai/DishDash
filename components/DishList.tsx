import React from "react";
import { FlatList, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import DishItem from "./DishItem";
import { Icon, ListItem } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  dishes: Dish[];
}

const [expanded, setExpanded] = React.useState(false);
const [checked, setChecked] = React.useState([]);
const [tags, setTags] = React.useState<String[]>([]);
const [selectedTags, setSelectedTags] = React.useState<String[]>([]);


const DishList: React.FC<Props> = ({ dishes }) => {
  React.useEffect(() => {
    getTags();
  });
  
  async function getTags() {
    try {
      const jsonValue = await AsyncStorage.getItem("tags");
      return jsonValue != null
        ? JSON.parse(jsonValue)
        : [
            "Breakfast",
            "Lunch",
            "Dinner",
            "Pork",
            "Chicken",
            "Vegetarian",
            "Weekday",
            "Weekend",
          ];
    } catch (e) {
      // error reading value
    }
  }
  
  return (
    <>
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>Dishes</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        icon={<Icon name="filter-list" type="material" />}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        {tags.map((l: String, i: number) => (
          <ListItem
            key={i}
            onPress={() => {
              dishes = changeFilter(l, dishes);
            }}
            bottomDivider
          >
            <ListItem.CheckBox
              // Use ThemeProvider to change the defaults of the checkbox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checked={selectedTags.includes(l)}
              onPress={() => (dishes = changeFilter(l, dishes))}
            />
            <ListItem.Content>
              <ListItem.Title>{l}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </ListItem.Accordion>

      <FlatList
        style={{
          width: "100%",
          backgroundColor: Colors[useColorScheme() ?? "light"]["background"],
        }}
        data={dishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DishItem dish={item} />}
      />
    </>
  );
};

export default DishList;
function changeFilter(l: String, dishes: Dish[]) {
  if (selectedTags.includes(l)) {
    selectedTags.splice(selectedTags.indexOf(l));
  } else {
    selectedTags.push(l);
  }

  dishes = dishes.filter((dish) =>
    dish.tags.some((tag) => selectedTags.includes(tag))
  );
  return dishes;
}
