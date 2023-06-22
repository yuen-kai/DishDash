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
  const [eaten, setEaten] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [expanded, setExpanded] = React.useState(false);
  const [expandedNew, setExpandedNew] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  // const [checked, setChecked] = React.useState([]);
  const [tags, setTags] = React.useState(() => {
    getTags(); // Call the function when the component mounts
    return [""]; // Initial state value
  });
  const [selectedTags, setSelectedTags] = React.useState<Set<String>>(
    new Set()
  );
  const [tagsChecked, setTagsChecked] = React.useState<boolean[]>([]);

  const [allDishes, setAllDishes] = React.useState<Dish[]>(() => {
    getDishes(); // Call the function when the component mounts
    return []; // Initial state value
  });
  const [dishes, setDishes] = React.useState<Dish[]>(allDishes);

  // getTags();

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
      let tagsArray =
        jsonValue != null
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
              "",
            ];
      setTags(tagsArray);
      setTagsChecked(new Array(tagsArray.length).fill(false));
    } catch (e) {
      // error reading value
    }
  }

  async function getDishes() {
    try {
      const jsonValue = await AsyncStorage.getItem("allDishes");
      let savedDishes =
        jsonValue != null
          ? JSON.parse(jsonValue)
          : [
              {
                name: "Pizza",
                tags: ["Lunch", "Dinner", "Pork"],
                lastEaten: 1,
                rating: 3,
              },
              {
                name: "Burger",
                tags: ["Chicken", "Lunch", "Weekend"],
                lastEaten: 1,
                rating: 3,
              },
              {
                name: "Pasta",
                tags: ["Tag1", "Tag2", "Tag3"],
                lastEaten: 1,
                rating: 3,
              },
            ];
      setAllDishes(savedDishes);
      setDishes(savedDishes);
    } catch (e) {
      // error reading value
    }
  }

  function changeFilter(l: String) {
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
  }

  function changeTags(i: number) {
    let updatedTags = [...tagsChecked];
    updatedTags[i] = !updatedTags[i];
    setTagsChecked(updatedTags);
  }

  const listOfTags = () => {
    let arrayOfTags: String[] = tags.filter(
      (value, index) => tagsChecked[index]
    );
    if (arrayOfTags.length > 0) {
      return "Tags: " + arrayOfTags.join(", ");
    }
    return "No tags";
  };
  // async function doSomethingWithSavedDishes() {
  //   dishes = await getSavedDishes();
  // }

  async function saveAllDishes(updatedDishes: Dish[]) {
    try {
      const jsonValue = JSON.stringify(updatedDishes);
      await AsyncStorage.setItem("allDishes", jsonValue);
    } catch (e) {
      // error reading value
    }
  }

  function handleSave() {
    let updatedDishes = [...allDishes];
    updatedDishes.push({
      name: name,
      tags: tags.filter((value, index) => tagsChecked[index]),
      lastEaten: parseInt(eaten),
      rating: rating,
    });
    setAllDishes(updatedDishes);
    setDishes(
      selectedTags.size == 0
        ? updatedDishes
        : updatedDishes.filter((dish) =>
            dish.tags.some((tag) => selectedTags.has(tag))
          )
    );
    saveAllDishes(updatedDishes);
    setVisible(false);
    setName("")
    setTagsChecked(tagsChecked.fill(false));
    setEaten("");
    setRating(3)
  }

  function handleDelete(dish: Dish) {
    let updatedDishes = [...allDishes];
    updatedDishes.splice(allDishes.indexOf(dish), 1);
    setAllDishes(updatedDishes);
    setDishes(
      selectedTags.size == 0
        ? updatedDishes
        : updatedDishes.filter((dish) =>
            dish.tags.some((tag) => selectedTags.has(tag))
          )
    );
    saveAllDishes(updatedDishes);
  }

  function addTag(){
    let updatedTags = [...tags];
    updatedTags.splice(tags.length-1,0,newTag)
    setTags(updatedTags);
    saveTags(updatedTags)
    setNewTag("")
  }

  async function saveTags(updatedTags: String[]){
    try {
      const jsonValue = JSON.stringify(updatedTags);
      await AsyncStorage.setItem("tags", jsonValue);
    } catch (e) {
      // error reading value
    }
  }

  return (
    <View style={styles.container}>
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
        }}
        isExpanded={expanded}
        icon={
          <Icon
            name="filter-list"
            type="material"
            color={Colors[colorScheme ?? "light"]["text"]}
          />
        }
        bottomDivider
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <FlatList
          data={tags}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => {
            return (
              <ListItem
                key={index}
                onPress={() => {
                  changeFilter(item);
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
                  checked={selectedTags.has(item)}
                  onPress={() => {
                    changeFilter(item);
                  }}
                  containerStyle={{
                    backgroundColor:
                      Colors[colorScheme ?? "light"]["background"],
                  }}
                />
                <ListItem.Content
                  style={{
                    backgroundColor:
                      Colors[colorScheme ?? "light"]["background"],
                  }}
                >
                  <ListItem.Title
                    style={{ color: Colors[colorScheme ?? "light"]["text"] }}
                  >
                    {item}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            );
          }}
        />
      </ListItem.Accordion>

      <FlatList
        style={{
          width: "100%",
          backgroundColor: Colors[colorScheme ?? "light"]["background"],
        }}
        data={dishes}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => {
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
              <Icon
                name="delete"
                type="material"
                color="grey"
                onPress={() => handleDelete(item)}
              />
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
      <Overlay
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        overlayStyle={{
          width: "80%",
          backgroundColor: Colors[colorScheme ?? "light"]["overlay"],
        }}
      >
        <Text title={true}>New Dish</Text>
        <Input
          placeholder="Add name"
          onChangeText={(value) => setName(value)}
          inputStyle={{ color: Colors[colorScheme ?? "light"]["text"] }}
          value={name}
          renderErrorMessage={false}
          errorMessage={
            dishes.some((value) => value.name.trim() == name.trim())
              ? "Name already used!"
              : ""
          }
          errorStyle={{ fontSize: 15 }}
          containerStyle={{ marginTop: 10 }}
        />
        <Input
          placeholder="Last Eaten (days)"
          onChangeText={(value) => setEaten(value)}
          inputStyle={{ color: Colors[colorScheme ?? "light"]["text"] }}
          value={eaten}
          renderErrorMessage={false}
          errorMessage={isNaN(eaten) ? "Invalid!" : ""}
          errorStyle={{ fontSize: 15 }}
          keyboardType="numeric"
          containerStyle={{ marginTop: 10 }}
        />
        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title
                style={{ color: Colors[colorScheme ?? "light"]["text"] }}
              >
                {listOfTags()}
              </ListItem.Title>
            </ListItem.Content>
          }
          containerStyle={{
            backgroundColor: Colors[colorScheme ?? "light"]["overlay"],
            width: "100%",
          }}
          isExpanded={expandedNew}
          icon={
            <Icon
              name="tag"
              type="material-community"
              color={Colors[colorScheme ?? "light"]["text"]}
            />
          }
          bottomDivider
          onPress={() => {
            setExpandedNew(!expandedNew);
          }}
        >
          <FlatList
            data={tags}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => {
              if (index == tags.length - 1) {
                return (
                  <ListItem
                    key={index}
                    onPress={() => {
                      changeTags(index);
                    }}
                    disabled={newTag == ""}
                    bottomDivider
                    containerStyle={{
                      backgroundColor:
                        Colors[colorScheme ?? "light"]["overlay"],
                      width: 300,
                    }}
                  >
                    <ListItem.CheckBox
                      // Use ThemeProvider to change the defaults of the checkbox
                      iconType="material-community"
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      checked={tagsChecked[index]}
                      disabled={newTag == ""}
                      onPress={() => {
                        changeTags(index);
                      }}
                      containerStyle={{
                        backgroundColor:
                          Colors[colorScheme ?? "light"]["overlay"],
                      }}
                    />
                    <ListItem.Content
                      style={{
                        backgroundColor:
                          Colors[colorScheme ?? "light"]["overlay"],
                      }}
                    >
                      <Input
                        placeholder="New Tag"
                        onChangeText={(value) => setNewTag(value)}
                        inputStyle={{
                          color: Colors[colorScheme ?? "light"]["text"],
                        }}
                        value={newTag}
                        renderErrorMessage={false}
                        errorMessage={
                          tags.some(
                            (value) => value.trim() == newTag.trim()
                          )
                            ? "Name already used!"
                            : ""
                        }
                        errorStyle={{ fontSize: 15 }}
                        containerStyle={{ marginTop: 10 }}
                        onSubmitEditing={()=>addTag()}
                      />
                    </ListItem.Content>
                  </ListItem>
                );
              }
              return (
                <ListItem
                  key={index}
                  onPress={() => {
                    changeTags(index);
                  }}
                  bottomDivider
                  containerStyle={{
                    backgroundColor: Colors[colorScheme ?? "light"]["overlay"],
                    width: 300,
                  }}
                >
                  <ListItem.CheckBox
                    // Use ThemeProvider to change the defaults of the checkbox
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checked={tagsChecked[index]}
                    onPress={() => {
                      changeTags(index);
                    }}
                    containerStyle={{
                      backgroundColor:
                        Colors[colorScheme ?? "light"]["overlay"],
                    }}
                  />
                  <ListItem.Content
                    style={{
                      backgroundColor:
                        Colors[colorScheme ?? "light"]["overlay"],
                    }}
                  >
                    <ListItem.Title
                      style={{ color: Colors[colorScheme ?? "light"]["text"] }}
                    >
                      {item}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              );
            }}
          />
        </ListItem.Accordion>

        <AirbnbRating
          showRating={false}
          onFinishRating={(value) => setRating(value)}
        />
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Button
            title="Cancel"
            containerStyle={{ flex: 1 }}
            buttonStyle={{ backgroundColor: "#777" }}
            onPress={() => setVisible(false)}
          />
          <Button
            title="Save"
            containerStyle={{ flex: 1 }}
            buttonStyle={{ backgroundColor: "#777" }}
            disabled={
              name == "" ||
              dishes.some((value) => value.name.trim() == name.trim()) ||
              eaten == "" ||
              isNaN(eaten)
            }
            disabledStyle={{ backgroundColor: "#555" }}
            onPress={() => handleSave()}
          />
        </View>
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
