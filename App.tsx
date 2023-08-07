import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Text, View } from "./Themed";
import {
  FAB,
  Overlay,
  Button,
  Input,
  AirbnbRating,
  Dialog,
  Icon,
  ListItem,
} from "@rneui/themed";
import React from "react";
import { FlatList, useColorScheme } from "react-native";
import Colors from "./Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

export default function TabTwoScreen() {
  // const colorScheme = useColorScheme();
  const colorScheme = "light"; //Mom's preferred color scheme
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [eaten, setEaten] = React.useState("");
  const [rating, setRating] = React.useState(3);
  const [recipe, setRecipe] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [expandedNew, setExpandedNew] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const noConfirmDish: Dish = {
    name: "[No dish selected!]",
    tags: [],
    lastEaten: -1,
    rating: -1,
    recipe: "",
  };
  const [confirmDish, setConfirmDish] = React.useState<Dish>(noConfirmDish);
  const [currentDish, setCurrentDish] = React.useState(noConfirmDish);
  const [currentVisible, setCurrentVisible] = React.useState(false);
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

  type TagsListProps = {
    index: number;
    onPress: () => void;
    background: string;
    checkedFunction: boolean;
    item: string;
  };

  const TagsList = (props: TagsListProps) => {
    const index = props.index;
    const onPress = props.onPress;
    const background = props.background;
    const checkedFunction = props.checkedFunction;
    const item = props.item;

    return (
      <ListItem
        key={index}
        onPress={onPress}
        disabled={index == tags.length - 1}
        bottomDivider
        containerStyle={[{
          backgroundColor: Colors[colorScheme ?? "light"][background]
        },background=="background"?{width: 400}:null]}
      >
        <ListItem.CheckBox
          // Use ThemeProvider to change the defaults of the checkbox
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checked={checkedFunction}
          disabled={index == tags.length - 1}
          onPress={onPress}
          containerStyle={{
            backgroundColor: Colors[colorScheme ?? "light"][background],
          }}
        />
        <ListItem.Content
          style={{
            backgroundColor: Colors[colorScheme ?? "light"][background],
          }}
        >
          {index == tags.length - 1 ? (
            <Input
              placeholder="New Tag"
              onChangeText={(value) => setNewTag(value)}
              inputStyle={{
                color: Colors[colorScheme ?? "light"]["text"],
              }}
              value={newTag}
              renderErrorMessage={false}
              errorMessage={
                tags.slice(0, -1).some((value) => value.trim() == newTag.trim())
                  ? "Name already used!"
                  : ""
              }
              errorStyle={{ fontSize: 15 }}
              containerStyle={{ marginTop: 10 }}
              onSubmitEditing={() => addTag()}
            />
          ) : (
            <ListItem.Title
              style={{
                color: Colors[colorScheme ?? "light"]["text"],
              }}
            >
              {item}
            </ListItem.Title>
          )}
        </ListItem.Content>
        {index != tags.length - 1 ? (
          <Icon
            name="delete"
            type="material"
            color="grey"
            onPress={() => handleDeleteTag(item)}
          />
        ) : (
          <Icon
            name="check"
            type="material"
            color={
              newTag == "" ||
              tags.slice(0, -1).some((value) => value.trim() == newTag.trim())
                ? "grey"
                : "green"
            }
            onPress={() => addTag()}
            disabled={
              newTag == "" ||
              tags.slice(0, -1).some((value) => value.trim() == newTag.trim())
            }
            disabledStyle={{ backgroundColor: "rgba(0,0,0,0)" }}
          />
        )}
      </ListItem>
    );
  };

  const ListItemWithCheckBox = ({ l }: { l: String }) => {
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

              //Date specific tags
              "Vegetarian",
              "Weekday",
              "Weekend",

              "", //placeholder for new tags,
            ];
      setTags(tagsArray);
      setTagsChecked(new Array(tagsArray.length).fill(false));
    } catch (e) {
      // error reading value
    }
  }

  async function setupDateSpecificTags(savedDishes: Dish[]) {
    let dateSpecificTagsList = new Set<String>();

    //[Insert check if is vegitarian day]

    if (new Date().getDay() == 0) {
      dateSpecificTagsList.add("Weekend");
    } else if (new Date().getDay() < 5) {
      dateSpecificTagsList.add("Weekday");
    } else if (new Date().getDay() == 6) {
      dateSpecificTagsList.add("Spaghetti");
    }

    setSelectedTags(dateSpecificTagsList);
    updateFilter(dateSpecificTagsList, savedDishes);
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
                tags: ["Chicken", "Lunch", "Weekend"],
                lastEaten: 1,
                rating: 3,
              },
            ];
      setAllDishes(savedDishes);
      setupDateSpecificTags(savedDishes);
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
    updateFilter(updatedTags, allDishes);
  }

  function updateFilter(
    updatedSelectedTags: Set<String>,
    listOfAllDishes: Dish[]
  ) {
    setDishes(
      updatedSelectedTags.size == 0
        ? listOfAllDishes
        : listOfAllDishes.filter((dish) =>
            dish.tags.some((tag) => updatedSelectedTags.has(tag))
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

  const listOfTagsDishes = () => {
    let arrayOfTags: String[] = tags.filter((value, index) =>
      selectedTags.has(value)
    );
    if (arrayOfTags.length > 0) {
      return "Tags: " + arrayOfTags.join(", ");
    }
    return "All dishes";
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

  const sortFuction = (a: Dish, b: Dish) => {
    return b.lastEaten + b.rating - (a.lastEaten + a.rating);
  };

  function handleSave() {
    let updatedDishes = [...allDishes];
    updatedDishes.push({
      name: name,
      tags: tags.filter((value, index) => tagsChecked[index]),
      lastEaten: parseInt(eaten),
      rating: rating,
      recipe: recipe,
    });
    updatedDishes.sort(sortFuction);
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
    setName("");
    setTagsChecked(tagsChecked.fill(false));
    setEaten("");
    setRating(3);
    setRecipe("");
  }

  function handleDelete(dish: Dish) {
    let updatedDishes = [...allDishes];
    updatedDishes.splice(allDishes.indexOf(dish), 1);
    saveDishes(updatedDishes);
  }

  function saveDishes(updatedDishes: Dish[]) {
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

  function handleDeleteTag(tag: string) {
    let updatedTags = [...tags];
    updatedTags.splice(tags.indexOf(tag), 1);
    let updatedDishes = [...allDishes];
    for (let i = 0; i < updatedDishes.length; i++) {
      let index = updatedDishes[i].tags.indexOf(tag);
      if (index > -1) {
        updatedDishes[i].tags.splice(index, 1);
      }
    }
    saveDishes(updatedDishes);
    setTags(updatedTags);
    saveTags(updatedTags);
  }

  function addTag() {
    if (
      newTag == "" ||
      tags.slice(0, -1).some((value) => value.trim() == newTag.trim())
    ) {
      return;
    }
    let updatedTags = [...tags];
    updatedTags.splice(tags.length - 1, 0, newTag);
    setTags(updatedTags);
    saveTags(updatedTags);
    setNewTag("");
  }

  async function saveTags(updatedTags: String[]) {
    try {
      const jsonValue = JSON.stringify(updatedTags);
      await AsyncStorage.setItem("tags", jsonValue);
    } catch (e) {
      // error reading value
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"]["background"] },
      ]}
    >
      <StatusBar style={colorScheme == "light" ? "dark" : "light"} />
      {currentVisible ? (
        <ListItem
          containerStyle={{
            backgroundColor: Colors[colorScheme ?? "light"]["background"],
            width: "100%",
          }}
          bottomDivider={true}
          onPress={() => {
            setConfirmDish(currentDish);
            setConfirmVisible(true);
          }}
        >
          <ListItem.Content
            style={{
              backgroundColor: Colors[colorScheme ?? "light"]["background"],
            }}
          >
            <ListItem.Title
              style={{
                color: Colors[colorScheme ?? "light"]["text"],
                fontSize: 20,
                alignSelf: "center",
              }}
            >
              Currently cooking: {currentDish.name}
            </ListItem.Title>
            {currentDish.tags.length > 0 ? (
              <ListItem.Subtitle
                style={{
                  color: Colors[colorScheme ?? "light"]["text"],
                  alignSelf: "center",
                }}
              >
                {currentDish.tags.join(", ")}
              </ListItem.Subtitle>
            ) : null}
            <AirbnbRating
              ratingContainerStyle={{ marginTop: 20, alignSelf: "center" }}
              size={25}
              showRating={false}
              isDisabled={true}
              defaultRating={currentDish.rating}
            />
            {currentDish.recipe != "" ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(currentDish.recipe)}
                style={{
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: "blue",
                    textDecorationLine: "underline",
                    fontSize: 15,
                  }}
                >
                  Recipe
                </Text>
              </TouchableOpacity>
            ) : null}
          </ListItem.Content>
        </ListItem>
      ) : null}

      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title
              style={{ color: Colors[colorScheme ?? "light"]["text"] }}
            >
              {listOfTagsDishes()}
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
          persistentScrollbar
          style={{ maxHeight: 300}}
          contentContainerStyle={{ alignItems: "stretch" }}
          data={tags}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <TagsList
              index={index}
              onPress={() => changeFilter(item)}
              background="background"
              checkedFunction={selectedTags.has(item)}
              item={item}
            />
          )}
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
              topDivider={true}
              onPress={() => {
                setConfirmDish(item);
                setConfirmVisible(true);
              }}
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
                {item.tags.length > 0 ? (
                  <ListItem.Subtitle
                    style={{ color: Colors[colorScheme ?? "light"]["text"] }}
                  >
                    {item.tags.join(", ")}
                  </ListItem.Subtitle>
                ) : null}
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
      <Dialog
        isVisible={confirmVisible}
        onBackdropPress={() => setConfirmVisible(false)}
        overlayStyle={{
          backgroundColor: Colors[colorScheme ?? "light"]["overlay"],
        }}
      >
        <Dialog.Title
          title={"Are you sure you want to cook " + confirmDish.name + "?"}
          titleStyle={{ color: Colors[colorScheme ?? "light"]["text"] }}
        />
        <Dialog.Actions>
          <Dialog.Button
            title="Yes"
            onPress={() => {
              setCurrentDish(confirmDish);
              dishes[dishes.indexOf(confirmDish)].lastEaten = 0;
              setConfirmVisible(false);
              setCurrentVisible(true);
              setConfirmDish(noConfirmDish);
              let updatedDishes = [...allDishes];
              updatedDishes.sort(sortFuction);
              setAllDishes(updatedDishes);
              setDishes(updatedDishes);
            }}
          />
          <Dialog.Button
            title="Cancel"
            onPress={() => setConfirmVisible(false)}
          />
        </Dialog.Actions>
      </Dialog>
      <FAB
        placement="right"
        icon={{ name: "add", color: "white" }}
        color="blue"
        onPress={() => setVisible(true)}
      />
      {newDishOverlay()}
    </SafeAreaView>
  );

  function newDishOverlay() {
    return (
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
          errorMessage={isNaN(Number(eaten)) ? "Invalid!" : ""}
          errorStyle={{ fontSize: 15 }}
          keyboardType="numeric"
          containerStyle={{ marginTop: 10 }}
        />
        <Input
          placeholder="Recipe Link"
          onChangeText={(value) => setRecipe(value)}
          inputStyle={{ color: Colors[colorScheme ?? "light"]["text"] }}
          value={recipe}
          renderErrorMessage={false}
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
            persistentScrollbar
            style={{ maxHeight: 100 }}
            contentContainerStyle={{ alignItems: "stretch" }}
            data={tags}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TagsList
                index={index}
                onPress={() => changeTags(index)}
                background="overlay"
                checkedFunction={tagsChecked[index]}
                item={item}
              />
            )}
          />
        </ListItem.Accordion>

        <AirbnbRating
          showRating={false}
          onFinishRating={(value) => setRating(value)}
          size={30}
          ratingContainerStyle={{marginTop: 15}}
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
              isNaN(Number(eaten))
            }
            disabledStyle={{ backgroundColor: "#555" }}
            onPress={() => handleSave()}
          />
        </View>
      </Overlay>
    );
  }
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
