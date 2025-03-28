import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { primaryColor, secondaryColor } from '../constants/colors'; // adjust the path as necessary



export const icons = {
    index: (props) => (<MaterialCommunityIcons name="home-circle-outline" size={24} color={secondaryColor} {...props} />),
    map: (props) => (<MaterialCommunityIcons name="map-marker-radius-outline" size={26} color={secondaryColor} {...props} />),
    about: (props) => (<Feather name="users" size={24} color={secondaryColor} {...props} />),
  };