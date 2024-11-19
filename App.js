import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const fadeAnim = new Animated.Value(1); // Animation state

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks from AsyncStorage", error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever the tasks state changes
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to AsyncStorage", error);
      }
    };
    saveTasks();
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTask("");
      animateTask();
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Start editing a task
  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTask(taskToEdit.text);
    setEditingTask(taskId);
  };

  // Update a task
  const updateTask = () => {
    if (task.trim()) {
      setTasks(
        tasks.map((item) =>
          item.id === editingTask ? { ...item, text: task } : item
        )
      );
      setTask("");
      setEditingTask(null);
    }
  };

  // Delete a task
  const deleteTask = (taskId) => {
    animateTaskOut(() => {
      setTasks(tasks.filter((task) => task.id !== taskId));
    });
  };

  // Animation: Fade in
  const animateTask = () => {
    fadeAnim.setValue(0); // Start invisible
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Animation: Fade out
  const animateTaskOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={editingTask ? "Edit task" : "Add a new task"}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editingTask ? updateTask : addTask}>
          <Text style={styles.addButtonText}>
            {editingTask ? "Update" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.taskContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id)}
              style={styles.taskTextContainer}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <View style={styles.taskButtons}>
              <TouchableOpacity
                onPress={() => startEditing(item.id)}
                style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  taskButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#ffc107",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default App;
