import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CategoryContext from '../CategoryContext';
import { Menu, Button } from 'react-native-paper'

const Course = ({ id, title, meets, index, moveCourse, categoryId }) => {
  const categories = useContext(CategoryContext)
  const [visible, setVisible] = useState(false);
  const menuToggle = () => visible ? setVisible(false) : setVisible(true);
  const courseTrigger = (
    <View style={styles.viewStyle}>
      <Button onPress={menuToggle} icon='drag-variant'>
        <Text style={styles.text}> {`${title}`} </Text>
      </Button>
    </View>)

  return (
    <View style={styles.container}>
      <Menu visible={visible} onDismiss={menuToggle}
        anchor={courseTrigger}>
        {categories.map((category, i) =>
          <Menu.Item key={i} title={category.name}
            onPress={() => {
              moveCourse(categoryId, index, i)
              menuToggle()
            }} />)}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  picker: {
    width: 250,
    height: 30,
    backgroundColor: '#B19CD9',
    borderRadius: 4,
  },
  text: {
    fontSize: 15,
    textTransform: "none",
    color: '#000',
  },
  viewStyle: {
    flex: 1,
    flexDirection: 'row'
  }
});

export default Course;
