import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { getSavedDishes } from "../SavedDishes";
import { FAB, Overlay, Button, Input, AirbnbRating } from "@rneui/themed";
import React, { useMemo } from "react";
import { FlatList, useColorScheme } from "react-native";
import Colors from "c:/Users/cykai/DishDash/constants/Colors";
import DishItem from "c:/Users/cykai/DishDash/components/DishItem";
import { Icon, ListItem } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slider } from "@rneui/base";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [expanded, setExpanded] = React.useState(false);
  // const [checked, setChecked] = React.useState([]);
  const [tags, setTags] = React.useState<String[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<Set<String>>(
    new Set()
  );
  const [dishes, setDishes] = React.useState<Dish[]>([
    {
      id: 1,
      name: "Pizza",
      tags: ["Lunch", "Dinner", "Pork"],
      lastEaten: 1,
      rating: 3,
    },
    {
      id: 2,
      name: "Burger",
      tags: ["Chicken", "Lunch", "Weekend"],
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
  ]);
  const allDishes = [
    {
      id: 1,
      name: "Pizza",
      tags: ["Lunch", "Dinner", "Pork"],
      lastEaten: 1,
      rating: 3,
    },
    {
      id: 2,
      name: "Burger",
      tags: ["Chicken", "Lunch", "Weekend"],
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

  React.useEffect(() => {
    getTags();
  });

  const ListItemWithCheckBox = ({ l }) => {
    const checked = false;

    return (
      <>
        <ListItem.CheckBox
          // Use ThemeProvider to change the defaults of the checkbox
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checked={checked}
          onPress={() => {
            console.log("Hello");
            changeFilter(l);
          }}
          containerStyle={{
            backgroundColor: Colors[colorScheme ?? "light"]["background"],
          }}
        />
        <ListItem.Content
          style={{
            backgroundColor: Colors[colorScheme ?? "light"]["background"],
          }}
        >
          <ListItem.Title
            style={{ color: Colors[colorScheme ?? "light"]["text"] }}
          >
            {l}
          </ListItem.Title>
        </ListItem.Content>
      </>
    );
  };

  async function getTags() {
    try {
      const jsonValue = await AsyncStorage.getItem("tags");
      setTags(
        jsonValue != null
          ? JSON.parse(jsonValue)
          : [
              "Breakfast",
              "Lunch",
              "Dinner",
              // "Pork",
              // "Chicken",
              // "Vegetarian",
              // "Weekday",
              // "Weekend",
            ]
      );
    } catch (e) {
      // error reading value
    }
  }

  function changeFilter(l: String) {
    console.log("hmmmm");
    const updatedTags = new Set(selectedTags);
    if (selectedTags.has(l)) {
      updatedTags.delete(l);
    } else {
      updatedTags.add(l);
    }
    setSelectedTags(updatedTags);
    setDishes(
      updatedTags.size == 0
        ? allDishes
        : allDishes.filter((dish) =>
            dish.tags.some((tag) => updatedTags.has(tag))
          )
    );
    console.log(updatedTags);
  }
  // async function doSomethingWithSavedDishes() {
  //   dishes = await getSavedDishes();
  // }

  return (
    <View style={styles.container}>
      <Text title={true}>Dishes</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title
              style={{ color: Colors[colorScheme ?? "light"]["text"] }}
            >
              Dishes
            </ListItem.Title>
          </ListItem.Content>
        }
        containerStyle={{
          backgroundColor: Colors[colorScheme ?? "light"]["background"],
          width: "100%",
          alignItems: "stretch",
        }}
        isExpanded={expanded}
        icon={
          <Icon
            name="filter-list"
            type="material"
            color={Colors[colorScheme ?? "light"]["text"]}
          />
        }
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        {tags.map((l: String, i: number) => (
          <ListItem
            key={i}
            onPress={() => {
              console.log("hello")
              changeFilter(l);
            }}
            bottomDivider
            containerStyle={{
              backgroundColor: Colors[colorScheme ?? "light"]["background"],
              width: 300,
            }}
          >
            <ListItem.CheckBox
              // Use ThemeProvider to change the defaults of the checkbox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checked={selectedTags.has(l)}
              onPress={() => {
                console.log("Hello");
                changeFilter(l);
              }}
              containerStyle={{
                backgroundColor: Colors[colorScheme ?? "light"]["background"],
              }}
            />
            <ListItem.Content
              style={{
                backgroundColor: Colors[colorScheme ?? "light"]["background"],
              }}
            >
              <ListItem.Title
                style={{ color: Colors[colorScheme ?? "light"]["text"] }}
              >
                {l}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </ListItem.Accordion>

      <FlatList
        style={{
          width: "100%",
          backgroundColor: Colors[colorScheme ?? "light"]["background"],
        }}
        data={dishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <ListItem
              containerStyle={{
                backgroundColor: Colors[colorScheme ?? "light"]["background"],
              }}
              bottomDivider={true}
            >
              <ListItem.Content
                style={{
                  backgroundColor: Colors[colorScheme ?? "light"]["background"],
                }}
              >
                <ListItem.Title
                  style={{ color: Colors[colorScheme ?? "light"]["text"] }}
                >
                  {item.name}
                </ListItem.Title>
                <ListItem.Subtitle
                  style={{ color: Colors[colorScheme ?? "light"]["text"] }}
                >
                  {item.tags.join(", ")}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          );
        }}
      />
      <FAB
        placement="right"
        icon={{ name: "add", color: "white" }}
        color="blue"
        onPress={() => setVisible(true)}
      />
      <Overlay isVisible={visible} onBackdropPress={() => setVisible(false)}>
        <Text title={true}>New Dish</Text>
        <Input
          containerStyle={{ width: "100%" }}
          placeholder="Add name"
          onChangeText={(value) => setName(value)}
          value={name != "" ? name : ""}
        />
        <AirbnbRating
          showRating={false}
          onFinishRating={(value) => setRating(value)}
        />
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
