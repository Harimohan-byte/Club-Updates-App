import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateUpdate from "./screens/CreateUpdate";
import Dashboard from "./screens/Dashboard";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UpdateDetails from "./screens/UpdateDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CreateUpdate" component={CreateUpdate} />
        <Stack.Screen name="UpdateDetails" component={UpdateDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
