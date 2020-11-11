import { Button, Chip, List, Menu, Searchbar } from 'react-native-paper';
import React, { useCallback, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import AddCourseResult from '../components/AddCourseResult';
import CategoryContext from '../CategoryContext';
import { getFuse } from '../Search';
import { mockCourses } from '../mockCourses';

const AddCourseScreen = ({ navigation }) => {
  const { categories } = useContext(CategoryContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const menuToggle = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const Fuse = getFuse(mockCourses);

  const updateQuery = (str) => {
    setSearchQuery(str);
    if (str.length < 3) {
      setMatches([]);
      return;
    }
    setMatches(Fuse.search(str));
  };

  const addSelectedCourse = (index) => {
    setSelectedCourses([...selectedCourses, index]);
  };

  const commitChanges = useCallback(() => {
    navigation.navigate('HomeScreen', {
      addSelectedCourses: selectedCourses.map((idx) => mockCourses[idx]),
      addCourseCategory: selectedCategory,
    });
  }, [selectedCourses, selectedCategory]);

  const rmCourse = useCallback(
    (index) => {
      setSelectedCourses(selectedCourses.filter((refIndex) => refIndex !== index));
    },
    [selectedCourses]
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.addCourseContainer} keyboardDismissMode='on-drag'>
          <Searchbar
            placeholder='Search Courses'
            onChangeText={updateQuery}
            value={searchQuery}
            autoFocus={true}
            style={styles.searchBarStyle}
          />
          {selectedCourses.length !== 0 && (
            <View style={styles.selectedCourseContainer}>
              {selectedCourses.map((courseIdx) => (
                <Chip mode={'outlined'} style={styles.chipStyle} onClose={() => rmCourse(courseIdx)}>
                  {mockCourses[courseIdx].name}
                </Chip>
              ))}
            </View>
          )}
          <View style={styles.courseResults}>
            {matches
              .filter((course) => selectedCourses.indexOf(course.refIndex) === -1)
              .slice(0, 10)
              .map((course, i) => (
                <AddCourseResult
                  idx={course.refIndex}
                  key={i}
                  course={course['item']}
                  addSelectedCourse={addSelectedCourse}
                />
              ))}
          </View>
          <Menu
            contentStyle={styles.menuItems}
            visible={menuOpen}
            onDismiss={menuToggle}
            anchor={
              <List.Item
                title={categories[selectedCategory].name}
                titleStyle={styles.categoryListTitle}
                style={styles.categoryListStyle}
                right={(props) => <List.Icon {...props} style={styles.categoryListIcon} icon='chevron-down' />}
                onPress={menuToggle}
              />
            }
          >
            {categories.map((category, i) => {
              return (
                <Menu.Item
                  key={i}
                  title={category.name}
                  onPress={() => {
                    setSelectedCategory(i);
                    menuToggle();
                  }}
                />
              );
            })}
          </Menu>
          <Button
            labelStyle={styles.confirmLabel}
            style={styles.confirmButton}
            onPress={commitChanges}
            mode={'contained'}
            disabled={!selectedCourses.length}
          >
            Add Courses
          </Button>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  courseResults: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
  },
  searchBarStyle: {
    marginTop: 20,
    marginHorizontal: 4,
  },
  selectedCourseContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 20,
  },
  addCourseContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 40,
    height: '100%',
  },
  chipStyle: {
    marginRight: 5,
    marginBottom: 5,
  },
  listIconStyle: {
    marginLeft: 0,
    marginRight: 0,
    width: 20,
  },
  categoryListStyle: {
    lineHeight: 48,
    fontSize: 18,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
    paddingVertical: 0,
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 40,
  },
  confirmButton: {
    marginHorizontal: 4,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    color: 'white',
  },
});
export default AddCourseScreen;
